/*
* adapt-diffuseAssessment
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define(function(require) {
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var HBS = require('extensions/adapt-diffuseAssessment/js/handlebars-v1.3.0');
    
    var DAFeedback = ComponentView.extend({
        events: {
            "click .printbutton": "onPrintClick"
        },

        preRender: function() {
            var thisHandle = this;
            this.$el.on("inview", function() {
                thisHandle.setCompletionStatus();
            })
        },

        postRender: function() {

            this.$el.addClass("not-complete");

            this.listenTo(Adapt, "diffuseAssessment:assessmentComplete", this.assessmentComplete);
            this.listenTo(Adapt, "device:resize device:change", this.resize);
            this.listenTo(Adapt, "remove", this.remove);
            this.setReadyStatus();

            var model = this.model.get("_diffuseAssessment");
            var assess = model._assessmentId;
            if (assess === undefined) return;

            if (model._isDisplayAsImage) this.$el.addClass("is-displayasimage");
            else this.$el.addClass("not-displayasimage");

            var assessment = Adapt.diffuseAssessment.getAssessmentById(assess);

            if (!model._isResetOnRevisit && assessment._isComplete) {
                assessment.process();
                this.assessmentComplete(assessment);
            }

        },

        assessmentComplete: function(assess) {

            this.setCompletionStatus();

            var assessment = this.model.get("_diffuseAssessment");
            if (assess._id != assessment._assessmentId) return;

            var _feedback = assessment['_feedback'];
            var feedback = undefined;
            for (var f = 0; f < _feedback.length; f++) {
                var item = _feedback[f];
                if (item._forScoreAsPercent !== undefined && item._forScoreAsPercent._max >= assess._scoreAsPercent && item._forScoreAsPercent._min <= assess._scoreAsPercent ) {
                    feedback = item;
                    break;
                } else if (item._forScore !== undefined && item._forScore._max >= assess._score && item._forScore._min <= assess._score ) {
                    feedback = item;
                    break;
                } else if (item._forPoints !== undefined && item._forPoints._max >= assess._currentPoints && item._forPoints._min <= assess._currentPoints ) {
                    feedback = item;
                    break;
                } else if (item._forGroup !== undefined && assess._currentGroup.indexOf(item._forGroup) > -1 ) {
                    if (assess._isMultipleMatches) {
                        if (feedback == undefined) feedback = [];
                        feedback.push(item);
                    } else {
                        feedback = item;
                        break;
                    }
                }
            }

            if (feedback === undefined) return;

            var block =  this.model.getParent();
            var article =  block.getParent();
            var page = article.getParent();
            var menu = page.getParent();

            var parameters = _.extend({
                _parentBlock: block.toJSON(),
                _parentArticle: article.toJSON(),
                _parentPage: page.toJSON(),
                _parentMenu: menu.toJSON(),
                _parentCourse: Adapt.course.toJSON()
            }, assess);

            if (_.isArray(feedback)) {
                var body = "";
                _.each(feedback, function(item) {
                    if (item._isOnlyAlone) {
                        if (feedback.length > 1) return;
                    }
                    body+=HBS.compile(item.body)(parameters);
                });
                var title = HBS.compile(this.model.get("title"))(parameters);
                this.$el.find(".component-title-inner").html(title);
                if (assessment._feedbackHeader) {
                    body = assessment._feedbackHeader+body;
                }
                if (assessment._feedbackFooter) {
                    body+= assessment._feedbackFooter;
                }
                this.$el.find(".component-body-inner").html(body);
            } else {
                this.$el.find(".component-title-inner").html(HBS.compile(feedback.title)(parameters));
                this.$el.find(".component-body-inner").html(HBS.compile(feedback.body)(parameters));
            }

            var thisHandle = this;
            this.$el.removeClass("not-complete");
            this.$el.addClass("is-complete");

            var model = this.model.get("_diffuseAssessment");

            if (model._isDisplayAsImage) {

                html2img(this.$el, function(data) {
                    var img = new Image();
                    img.src = data;
                    $(img).css("cursor", "pointer").attr("id","outputimg");

                    thisHandle.$el.children("#outputimg").remove();
                    thisHandle.$el.append(img);

                    if (assessment._hideUntilComplete && !assess._isComplete) {
                        this.$(".component-inner").css("display", "none").addClass("display-none");
                    } else if (assessment._hideUntilComplete && assess._isComplete) {
                        this.$(".component-inner").css("display", "").removeClass("display-none").fadeIn(assessment._showAnimationDuration || 2000)
                    }

                }, function(clone) {
                    if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                    else clone.css("width", thisHandle.$el.parent().width() + "px");
                });
            } else {

                if (assessment._hideUntilComplete && !assess._isComplete) {
                        this.$(".component-inner").css("display", "none").addClass("display-none");
                    } else if (assessment._hideUntilComplete && assess._isComplete) {
                        this.$(".component-inner").css("display", "").removeClass("display-none").fadeIn(assessment._showAnimationDuration || 2000)
                    }

            }

        },

        resize: function() {
            if (!this.$el.hasClass("is-complete")) return;
            var model = this.model.get("_diffuseAssessment");
            if (!model._isDisplayAsImage) return;

            var thisHandle = this;
            thisHandle.$el.children("#outputimg").remove();

            html2img(this.$el, function(data) {

                var img = new Image();
                img.src = data;
                $(img).css("cursor", "pointer").attr("id","outputimg");

                thisHandle.$el.append(img);

            }, function(clone) {
                if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                else clone.css("width", thisHandle.$el.parent().width() + "px");
            });

        },

        onPrintClick: function () {
            var thisHandle = this;
            var model = this.model.get("_diffuseAssessment");

            html2img(this.$el, function(data) {

                Adapt.trigger("printPreview:open", {
                    title: model.printTitle,
                    instructions: model.printInstructions,
                    _rendered: data,
                    postRender: function(settings) {

                        var img = new Image();
                        img.src = settings._rendered;
                        this.$el.html("").append(img);

                    }
                })

            }, function(clone) {
                if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                else clone.css("width", thisHandle.$el.parent().width() + "px");
            });
        }

    });

    Adapt.register("diffuseAssessmentFeedback", DAFeedback);

    return DAFeedback;
});
