# Introduction

Here's the place you'll find and embrace our development model.
The project is not very huge but relatively complicated, each steps needs be respected
in the right way, in order to have a clean and enjoyable workflow.
Overall, each parts of the project (api, front, mobile-app) respect its own structure and flow,
be sure to take note with the developers who are working in those parts, to be fully aware of the latters.
If you encounter some difficulties, please refers to the [main maintainer of the project](https://github.com/Nero-F).

# Contribute [WIP]
## Existing tasks

> ⚠️: This part concern tasks that has already be assigned to you

First things first, pick a card/issue in the desire part you want to work on, situated in the [Projects](https://github.com/EpitechIT2020/B-YEP-500-BDX-5-1-area-fahad.assoumani/projects) section of  the github repository.

If its not done, move it to the `In Progress` column, also if the card is not already an issue convert it.
Then you can start by creating a branch that will be the reference of your work

Todo so, follow the following steps:

> ⚠️: Be sure to switch to the [front|back|mobile]_dev branch and have the `develop` up to date before anything. These branches will be the starting point of all your work on the project. 

```$ git checkout -b $BRANCH_NAME```

Do your stuff and commit it:

```$ git commit -b "[$LABEL] ..." ```

### Upstream
If the tip of the current branch is behind its remote counterpart:
_this basically means that there's modification in the remote branch you don't have in the local._

```$ git rebase $BRANCH_NAME```

The same command is applied when you want to commit and there's modification you don't have in the targeted branch.

If there's work that you don't want to loose be sure to make a `$ git stash` before pull/rebase.

***
_refers to this [section](https://github.com/EpitechIT2020/B-YEP-500-BDX-5-1-area-fahad.assoumani/wiki/How-To-Contribute/_edit#naming-convention) to know about labels and naming convention._

## Naming Convention

|BRANCH_NAME|Description                               |
|-----------|------------------------------------------|
|master     | the production env                       | 
|develop    | the preproduction env                    |
|feature/$$ | branch starting from one of the three above corresponding to the development of a feature |
|bugfix/$$  | fixing branch in case of major bug       |

|LABEL|Description                         |
|-----|------------------------------------|
|ADD  | adding files or new elements       |
|FEAT | features is finished               |
|MOD  | modify or update elements/features |
|DEL  | deletes files/elements/features    |
|FIX  | resolve a bug                      |


## Git Workflow
The Contribute section describe a strategy to follow this workflow.
![](https://github.com/Nero-F/Epidemy/blob/master/rsrcs/git_workflow_diag.png)
