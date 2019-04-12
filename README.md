# NodeSchool Organizer

Set of helpers to create NodeSchool events.

```javascript
const organizer = require('nodeschool-organizer');

const answers = organizer.askQuestions("My Chapter")
.then(organizer.previewAnswers)
.then((data) => {
  console.log(data);
});
```
