# Commit Message Convention

Project Rootly follows the Conventional Commits specification to maintain a clear and structured commit history. This convention enables automatic changelog generation and semantic versioning.

## Format

Each commit message should follow this structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

The type must be one of the following:

- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation changes only
- **style**: Code style changes (formatting, missing semicolons, etc.) that do not affect functionality
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, or tooling
- **ci**: Changes to CI/CD configuration files and scripts

### Scope

The scope specifies which component is affected by the change. For Project Rootly, use one of:

- **webapp**: Changes to the web application (frontend or backend)
- **backend**: Backend-specific changes
- **frontend**: Frontend-specific changes
- **sdk**: Runtime SDK changes
- **extension**: VS Code extension changes
- **docs**: Documentation changes
- **deps**: Dependency updates
- **config**: Configuration file changes

The scope is optional but recommended for clarity in multi-component projects.

### Subject

The subject is a brief description of the change:

- Use imperative, present tense: "add" not "added" or "adds"
- Do not capitalize the first letter
- Do not end with a period
- Keep it concise (50 characters or less)

### Body

The body provides additional context about the change:

- Use imperative, present tense
- Explain what and why, not how
- Wrap lines at 72 characters
- Separate from subject with a blank line

The body is optional for simple changes.

### Footer

The footer contains metadata about the commit:

- **Breaking Changes**: Start with `BREAKING CHANGE:` followed by description
- **Issue References**: Reference related issues with `Closes #123` or `Fixes #456`

## Examples

### Feature Addition

```
feat(sdk): add severity levels for error capture

Implement support for error, warning, and info severity levels
in the runtime SDK. This allows developers to categorize issues
based on their impact.

Closes #45
```

### Bug Fix

```
fix(extension): resolve file path parsing for Windows

Update stack trace regex to handle Windows paths with spaces.
File locations now display correctly in the incident list.

Fixes #78
```

### Documentation Update

```
docs(readme): update installation instructions

Add troubleshooting section for common setup issues and clarify
database configuration steps for new contributors.
```

### Breaking Change

```
feat(backend): restructure ingest API payload format

Change ingest endpoint to accept structured payload with separate
error and context objects for better validation and extensibility.

BREAKING CHANGE: Ingest endpoint now requires structured payload
instead of flat fields. Update SDK to version 1.2.0 or higher.

Closes #92
```

### Multiple Scopes

```
chore(webapp): upgrade dependencies to latest versions

Update Next.js to 15.1.6, Prisma to 6.2.0, and TypeScript to 5.7.3
across both frontend and backend components.
```

### Simple Fix

```
fix(frontend): correct typo in dashboard header
```

## Component-Specific Examples

### Backend Changes

```
feat(backend): add pagination to incidents API
fix(backend): resolve session race condition in OAuth flow
refactor(backend): extract API key validation to middleware
```

### Frontend Changes

```
feat(frontend): implement project deletion confirmation modal
fix(frontend): correct responsive layout on mobile devices
style(frontend): update button hover states for consistency
```

### Runtime SDK Changes

```
feat(sdk): implement graceful shutdown with pending request tracking
fix(sdk): correct environment fallback to NODE_ENV
perf(sdk): optimize rate limiter from O(n²) to O(n)
```

### IDE Extension Changes

```
feat(extension): add go to error location functionality
fix(extension): handle stack traces with spaces in file paths
docs(extension): update README with new features
```

## Integration with CHANGELOG.md

Commits following this convention enable automatic changelog generation:

- **feat** commits appear under "Added" section
- **fix** commits appear under "Fixed" section
- **perf** commits appear under "Performance" section
- **BREAKING CHANGE** footer creates a special section

## Best Practices

1. **Keep commits atomic**: Each commit should represent a single logical change
2. **Write meaningful messages**: Future contributors should understand the change without reading the code
3. **Reference issues**: Link commits to related issues for traceability
4. **Use present tense**: Describe what the commit does, not what you did
5. **Be specific with scopes**: Help others quickly identify affected components
6. **Explain breaking changes**: Always document API changes that affect users

## Validation

Before committing, verify your message follows the convention:

- Does it start with a valid type?
- Is the scope appropriate for the changed component?
- Is the subject clear and concise?
- Are breaking changes properly documented?

Following these conventions ensures a professional, maintainable commit history that benefits all contributors.
