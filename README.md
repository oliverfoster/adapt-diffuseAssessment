adapt-diffuseAssessment
================

Dependencies: [adapt-html2img](https://github.com/cgkineo/adapt-html2img)

Multiple, centralized, cross-element (page/article/block) assessments.

Build assessment trees. Output the results for an assessment on any/many pages as a component. Use the public interface to extend.

Example Assessment Tree:
```
COURSE		  PAGE 			  COMPONENT
assessment1 > assessment2	> c-125
							> c-126
							> c-127
							> c-128
							.
							.
							.

			> assessment3	> c-209
							> c-210
							> c-211
							> c-212
							.
							.
							.
			.
			.
			.
.
.
.

```

Diffuse Assessment Public Interface:
```
Adapt.diffuseAssessment.getAssessments(); //will return all assessments
Adapt.diffuseAssessment.getAssessmentById(id); //returns assessment with id ("assessment1" / "assessment2" / etc)
Adapt.diffuseAssessment.getAssessmentsByParentId(id); //will return all assessments at element id ("course" / "c-20" / "a-01" / "b-22" / etc);
Adapt.diffuseAssessment.getAssessmentsByComponentId(id); //will return all assessments listening for component id completion ( c-209 / etc)
Adapt.diffuseAssessment.model;
```


Diffuse Assessment Model:
```
{
	_assessments: [],	//directly from course.json
	_assessmentsByComponentId: {	//sorted by component id
		c-125: {
			assessment2: {

			}
		},
		c-126: {
			assessment2: {
			
			}
		},
		c-127: {
			assessment2: {
			
			}
		},
		c-128: {
			assessment2: {
			
			}
		},
		c-209: {
			assessment3: {

			}
		},
		c-210: {
			assessment3: {
			
			}
		},
		c-211: {
			assessment3: {
			
			}
		},
		c-212: {
			assessment3: {
			
			}
		}
	},
	_assessmentsById: { //sorted by assessment id
		assessment1: {

		},
		assessment2: {

		},
		assessment3: {

		}
	},
	_assessmentsByParentId: { //sorted by parent element id
		co-45: {
			assessment3: {

			},
			assessment2: {

			}
		},
		course: {
			assessment1: {

			}
		}
	},
	_assets: {
		"articles": [],
		"blocks": [],
		"pages": []
	}
	_isEnabled: true
}
```

Example assessment:
```
{
	_assessmentModels: { //children assessments

	},
	_assessments: [], //children assessments directly from page/article/block json
	_componentModels: { //children components

	},
	_components: [], //components directly from page/article/block json
	_feedback: { //feedback directly from page/article/block json
		{
            "_forScore": {	//use either _forScore or _forScoreAsPercent
                "_max": 1,
                "_min": 1
            },
            "_forScoreAsPercent": {
                "_min": 100,
                "_max": 100
            },
            "title": "{{_scoreAsPercent}}% Well done!",
            "body": "Good job on completing this question! You scored {{_scoreAsPercent}}%"
        },
        {
            "_forScore": { //use either _forScore or _forScoreAsPercent
                "_min": 0,
                "_max": 0
            },
            "_forScoreAsPercent": {
                "_min": 0,
                "_max": 0
            },
            "title": "{{_scoreAsPercent}}% Oops!",
            "body": "Unfortunately this score is not really very good!"
        }
	},
	_id: "", //assessment id directly from page/article/block json
	_isComplete: false,
	_parentId: "course", //element (page/article/block) id
	_parents: [], //parent assessments
	_possibleScore: 0, //total possible score
	_score: 0, //total score at completion
	_scoreAsPercent: 0, //percentage score
	calculateIdComplete(), //function to set _isComplete
	calculateScore(), //function to set _score and _scoreAsPercent
	getFeedback(), //function to get appropriate feedback
	title: "", //title of assessment (currently unused);
}
```

Example Feedback Component (to go in component json):
```
{
    "_id": "c-76",
    "_parentId": "b-66",
    "_type": "component",
    "_component": "diffuseAssessmentFeedback",
    "_classes": "",
    "_layout": "full",
    "title": "", //leave blank as taken from appropriate feedback
    "displayTitle": "",  //leave blank as taken from appropriate feedback
    "body": "",  //leave blank as taken from appropriate feedback
    "instruction": "",  //leave blank as taken from appropriate feedback
    "_diffuseAssessment": {
        "_assessmentId": "assessment2",
        "_isResetOnRevisit": true,
        "_isDisplayAsImage": true
    },
    "_pageLevelProgress": {
        "_isEnabled": false
    }
}
```

Configurations:
```
// To go in the course.json file
"_diffuseAssessment": {
    "_isEnabled": true,
    "_assessments": [ 
        {
            "_id": "assessment1",
            "title": "Global assessment number 1",
            "_assessmentWeight": 1,
            "_feedback": [
                {
                    "_forScore": { //use either _forScore or _forScoreAsPercent
                        "_max": 1,
                        "_min": 1
                    },
                    "_forScoreAsPercent": {
                        "_min": 100,
                        "_max": 100
                    },
                    "title": "{{_scoreAsPercent}}% Well done!",
                    "body": "Good job on completing this question! You scored {{_scoreAsPercent}}%"
                },
                {
                    "_forScore": { //use either _forScore or _forScoreAsPercent
                        "_min": 0,
                        "_max": 0
                    },
                    "_forScoreAsPercent": {
                        "_min": 0,
                        "_max": 0
                    },
                    "title": "{{_scoreAsPercent}}% Oops!",
                    "body": "Unfortunately this score is not really very good!"
                }
            ],
            "_assessments": [ "assessment2" ]
        }
    ]
}


// To go in course/page/article/block
"_diffuseAssessment": {
    "_isEnabled": true,
    "_id": "assessment2",
    "title": "Assessment for this section",
    "_assessmentWeight": 1,
    "_feedback": [
        {
            "_forScore": { //use either _forScore or _forScoreAsPercent
                "_min": 1,
                "_max": 1
            },
            "_forScoreAsPercent": {
                "_min": 100,
                "_max": 100
            },
            "title": "{{_scoreAsPercent}}% Well done!",
            "body": "Good job on completing this question! You scored {{_scoreAsPercent}}%"
        },
        {
            "_forScore": { //use either _forScore or _forScoreAsPercent
                "_min": 0,
                "_max": 0
            },
            "_forScoreAsPercent": {
                "_min": 0,
                "_max": 0
            },
            "title": "{{_scoreAsPercent}}% Oops!",
            "body": "Unfortunately this score is not really very good!"
        }
    ],
    "_components": [ "c-75" ]
}


//results, to go in components.json
{
    "_id": "c-76",
    "_parentId": "b-66",
    "_type": "component",
    "_component": "diffuseAssessmentFeedback",
    "_classes": "",
    "_layout": "full",
    "title": "",
    "displayTitle": "",
    "body": "",
    "instruction": "",
    "_diffuseAssessment": {
        "_assessmentId": "assessment2",
        "_isResetOnRevisit": true,
	    "_isDisplayAsImage": true
    },
    "_pageLevelProgress": {
        "_isEnabled": false
    }
}
```