# Branching Strategy

Project Rootly uses a structured Git workflow to maintain code quality and enable smooth collaboration. This document outlines the branching conventions and development workflow.

## Branch Types

### Main Branch

**Branch**: `main`

The main branch contains production-ready code. All code in main should be stable, tested, and deployable.

**Protection Rules**:
- Direct commits are discouraged
- All changes must go through pull requests
- Requires at least one approval before merging
- Must pass all CI checks before merging

### Development Branch

**Branch**: `develop`

The development branch serves as an integration branch for features. This is where ongoing development work is merged before being released to main.

**Usage**:
- Base all feature branches from develop
- Merge completed features into develop
- Periodically merge develop into main for releases

### Feature Branches

**Naming Convention**: `feature/<description>`

Feature branches are used to develop new features or enhancements.

**Examples**:
- `feature/error-dashboard`
- `feature/source-maps-support`
- `feature/team-collaboration`

**Workflow**:
1. Create from develop: `git checkout -b feature/my-feature develop`
2. Develop and commit changes following commit conventions
3. Push to remote: `git push origin feature/my-feature`
4. Open pull request to develop
5. Delete branch after merge

### Bugfix Branches

**Naming Convention**: `bugfix/<description>`

Bugfix branches address non-critical bugs found in develop or during development.

**Examples**:
- `bugfix/oauth-session-handling`
- `bugfix/stack-trace-parsing`
- `bugfix/api-key-validation`

**Workflow**:
1. Create from develop: `git checkout -b bugfix/issue-description develop`
2. Fix the bug and add tests
3. Open pull request to develop
4. Delete branch after merge

### Hotfix Branches

**Naming Convention**: `hotfix/<description>`

Hotfix branches address critical bugs in production that require immediate fixes.

**Examples**:
- `hotfix/security-vulnerability`
- `hotfix/data-loss-prevention`
- `hotfix/authentication-failure`

**Workflow**:
1. Create from main: `git checkout -b hotfix/critical-issue main`
2. Fix the critical issue
3. Open pull request to main
4. After merging to main, also merge to develop
5. Delete branch after merge

### Release Branches

**Naming Convention**: `release/<version>`

Release branches prepare for a new production release, allowing for final testing and minor bug fixes.

**Examples**:
- `release/1.3.0`
- `release/2.0.0`

**Workflow**:
1. Create from develop: `git checkout -b release/1.3.0 develop`
2. Update version numbers in package.json files
3. Update CHANGELOG.md with release notes
4. Perform final testing and bug fixes
5. Merge to main and tag the release
6. Merge back to develop
7. Delete branch after merge

## Workflow Examples

### Adding a New Feature

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/error-grouping

# Make changes and commit
git add .
git commit -m "feat(webapp): implement error grouping algorithm"

# Push to remote
git push origin feature/error-grouping

# Open pull request on GitHub to merge into develop
```

### Fixing a Bug

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create bugfix branch
git checkout -b bugfix/incident-pagination

# Fix the bug and commit
git add .
git commit -m "fix(backend): correct pagination offset calculation"

# Push and create pull request
git push origin bugfix/incident-pagination
```

### Handling a Production Hotfix

```bash
# Start from main
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/auth-bypass

# Fix the critical issue
git add .
git commit -m "fix(backend): patch authentication bypass vulnerability"

# Push and create pull request to main
git push origin hotfix/auth-bypass

# After merging to main, merge to develop
git checkout develop
git merge main
git push origin develop
```

### Preparing a Release

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.3.0

# Update version numbers
# Edit webapp/backend/package.json, webapp/frontend/package.json, etc.

# Update CHANGELOG.md with release notes

# Commit version updates
git add .
git commit -m "chore(release): prepare version 1.3.0"

# Push and create pull request to main
git push origin release/1.3.0

# After merging to main, tag the release
git checkout main
git pull origin main
git tag -a v1.3.0 -m "Release version 1.3.0"
git push origin v1.3.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

## Pull Request Requirements

All pull requests must meet the following criteria before merging:

### Code Quality
- Follows TypeScript best practices
- Passes all linting checks
- Includes appropriate type definitions
- No console.log statements in production code

### Testing
- Includes tests for new features
- All existing tests pass
- Manual testing completed for UI changes

### Documentation
- Updates README.md if user-facing changes
- Updates relevant documentation files
- Adds JSDoc comments for new functions
- Updates CHANGELOG.md for significant changes

### Review Process
- At least one approval from a maintainer
- All review comments addressed
- CI/CD pipeline passes successfully
- No merge conflicts with target branch

## Merge Strategies

### Feature/Bugfix to Develop
- Use **Squash and Merge** to keep develop history clean
- Ensure commit message follows convention
- Delete source branch after merge

### Develop to Main
- Use **Merge Commit** to preserve release history
- Create a merge commit with release notes
- Tag the merge commit with version number

### Hotfix to Main
- Use **Merge Commit** for traceability
- Tag immediately after merge
- Ensure hotfix is also merged to develop

## Branch Naming Best Practices

1. **Use lowercase**: All branch names should be lowercase
2. **Use hyphens**: Separate words with hyphens, not underscores
3. **Be descriptive**: Name should clearly indicate the purpose
4. **Keep it short**: Aim for 2-4 words after the prefix
5. **Avoid special characters**: Stick to letters, numbers, and hyphens

**Good Examples**:
- `feature/user-notifications`
- `bugfix/memory-leak`
- `hotfix/sql-injection`

**Bad Examples**:
- `feature/MyFeature` (not lowercase)
- `fix_bug` (missing type prefix)
- `feature/this-is-a-very-long-branch-name-that-describes-everything` (too long)

## Version Tagging

After merging to main, create a version tag:

```bash
git tag -a v1.3.0 -m "Release version 1.3.0 - Error Dashboard"
git push origin v1.3.0
```

Tag format: `v<major>.<minor>.<patch>`

Follow semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

## Keeping Branches Updated

Regularly sync your branch with the base branch:

```bash
# Update feature branch with latest develop
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# Or use merge if you prefer
git merge origin/develop
```

This workflow ensures a clean, organized repository with a clear history and smooth collaboration process.
