# Guide to Contributing

## The Team Norms
### Team Values
- (placeholder)
### Sprint Cadence
- Sprint 0: 02/15-02/27
- Sprint 1: 02/27-03/22
- Sprint 2: 03/22-04/10
- Sprint 3: 04/10-04/24
- Sprint 4: 04/24-05/03
### Daily Standups
- Pre-Scheduled Daily Standups are to be held the evening of the days lecture is held, Monday and Wednesdays. The third Daily Standup of the week is to be scheduled through when2meet.
- Once all group members are finished with the Daily Standup, paste the written stnadup in team_driply_standups text channel with the daily standup date.
### Coding Standards
- (placeholder)
- (ide, linter to universally use, etc.)
- (small commits, commenting code, etc.)

---
## The Git Workflow
1. Pull recent changes <br>
	`git pull origin master`

2. Create branch. Choose a branch name for what feature you’re doing <br>
	`git checkout -b <branch-name>`

    example: <br>
	`git checkout -b user-story/13/task/9/implement-user-login`

3. Update task board TASK to “In Process” 

4. Add and commit <br>
	`git add .` <br>
	`git commit -m “<message>”`

5. Merge remote changes <br>
	`git fetch origin` <br>
	`git merge origin/master`


6. Push branch changes to YOUR BRANCH <br>
	`git push origin <branch-name>`

7. Go on github, go to your branch and go to PULL REQUESTS. Create a pull request to push your branch into the main branch

8. Update task board TASK to awaiting review 

9. AFTER someone else reviews, approves and merges your code,
delete your branch <br>
	`git push origin -d <branch-name>` <br>
THEN switch back to master <br>
	`git checkout master`
THEN delete branch locally <br>
	`git branch -D <branch-name>`



    to check the branch you’re currently on: <br>
	   ` git rev-parse --abbrev-ref HEAD`

---
## Rules of Contributing and Any Considerations or How and What to Contribute
Follow the git workflow above.

---
## Setting up the local development environment
(Update with that information once the project reaches that stage.)

---
## Building and Testing the Project
(Update with that information once the project reaches that stage.)