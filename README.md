# Stage code with Amazon Echo
To Do:
1. Fix race conditions
  - Sometimes, Jenkins needs a second or two before reaching out to the Job URL after getting it from the queue
  - Sometimes, we're too slow to get back to Alexa and she quits on us (didn't happen before introducing JIRA search)
2. Maybe soften some of this up so that other folks can use it
