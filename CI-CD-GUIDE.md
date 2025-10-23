# CI/CD Setup Guide

## Overview

This project uses GitHub Actions for automated testing, security scanning, and NPM package publishing.

## Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Test & Build

- Runs on Node.js 18.x and 20.x
- Installs dependencies for both packages
- Runs all unit tests
- Generates coverage reports
- Uploads coverage to Codecov
- Builds both packages
- Verifies TypeScript compilation

#### Security Scan

- Runs CodeQL analysis for JavaScript/TypeScript
- Performs NPM security audit
- Checks for known vulnerabilities

#### Lint

- Code formatting checks
- Style validation (can be extended with ESLint/Prettier)

---

### 2. NPM Publishing (`.github/workflows/publish.yml`)

**Triggers:**

- GitHub Release is published
- Manual workflow dispatch

**Jobs:**

#### Publish Root Package

- Runs tests and builds the root package
- Publishes `@infinitesolutions/cybersource-rest-client` to NPM

#### Publish NestJS Package

- Runs tests with coverage
- Builds the NestJS package
- Publishes `@infinitesolutions/cybersource-nestjs` to NPM
- Attaches build artifacts to GitHub Release

**Manual Trigger Options:**

- Publish `root` package only
- Publish `nestjs` package only
- Publish `both` packages

---

### 3. Version Bump (`.github/workflows/version-bump.yml`)

**Triggers:**

- Manual workflow dispatch only

**Options:**

- **Package:** root, nestjs, or both
- **Version Type:** patch, minor, or major

**Actions:**

- Bumps package version(s) using `npm version`
- Updates dependencies if bumping both
- Commits version changes
- Creates Git tags
- Pushes to repository

---

## Setup Instructions

### Step 1: Create NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Go to **Account Settings** → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type
5. Copy the token (you'll only see it once!)

### Step 2: Add NPM Token to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM token
6. Click **Add secret**

### Step 3: Configure Repository Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### Step 4: Enable GitHub Releases

1. Go to your repository's main page
2. Click **Releases** (right sidebar)
3. You're now ready to create releases!

---

## Usage

### Running Tests Automatically

Tests run automatically on:

- Every push to `main` or `develop`
- Every pull request

**What gets tested:**

- ✅ Unit tests (84 tests)
- ✅ Code coverage (90%+ for utils)
- ✅ TypeScript compilation
- ✅ Security vulnerabilities
- ✅ Multiple Node.js versions (18.x, 20.x)

### Publishing to NPM

#### Method 1: Via GitHub Release (Recommended)

1. **Bump version first:**

   ```bash
   # For NestJS package
   cd nestjs
   npm version patch  # or minor, or major
   git push origin main --tags
   ```

2. **Create GitHub Release:**

   - Go to **Releases** → **Draft a new release**
   - Click **Choose a tag** → Create new tag (e.g., `v1.1.3`)
   - Fill in release title and notes
   - Click **Publish release**

3. **Automatic publishing:**
   - GitHub Actions will automatically:
     - Run all tests
     - Build the packages
     - Publish to NPM
     - Attach build artifacts

#### Method 2: Manual Workflow Dispatch

1. Go to **Actions** tab
2. Select **Publish to NPM** workflow
3. Click **Run workflow**
4. Choose which package(s) to publish
5. Click **Run workflow**

### Version Bumping

#### Automated Version Bump

1. Go to **Actions** tab
2. Select **Version Bump** workflow
3. Click **Run workflow**
4. Select:
   - **Package:** root / nestjs / both
   - **Version Type:** patch / minor / major
5. Click **Run workflow**

This will:

- Bump the version in `package.json`
- Create a git commit
- Create a git tag
- Push to repository

#### Manual Version Bump

```bash
# Root package
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# NestJS package
cd nestjs
npm version patch
npm version minor
npm version major

# Push changes
git push origin main --tags
```

---

## Semantic Versioning Guide

Follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

### PATCH (1.0.0 → 1.0.1)

Use for:

- Bug fixes
- Security patches
- Documentation updates
- Internal refactoring

```bash
npm version patch
```

### MINOR (1.0.0 → 1.1.0)

Use for:

- New features (backward compatible)
- New DTOs or services
- New utility functions
- Deprecating features (with warnings)

```bash
npm version minor
```

### MAJOR (1.0.0 → 2.0.0)

Use for:

- Breaking changes
- Removing deprecated features
- Changing public APIs
- Incompatible updates

```bash
npm version major
```

---

## Status Badges

Add these badges to your README:

```markdown
![CI/CD](https://github.com/tsee9iii/nestjs-cybersource-rest-client-ts/actions/workflows/ci.yml/badge.svg)
![NPM Version](https://img.shields.io/npm/v/@infinitesolutions/cybersource-nestjs)
![NPM Downloads](https://img.shields.io/npm/dm/@infinitesolutions/cybersource-nestjs)
![License](https://img.shields.io/npm/l/@infinitesolutions/cybersource-nestjs)
![Coverage](https://codecov.io/gh/tsee9iii/nestjs-cybersource-rest-client-ts/branch/main/graph/badge.svg)
```

---

## Monitoring & Notifications

### Build Status

- View build status in **Actions** tab
- Failed builds will send notifications to repository admins

### NPM Package Status

Check published packages:

- Root: https://www.npmjs.com/package/@infinitesolutions/cybersource-rest-client
- NestJS: https://www.npmjs.com/package/@infinitesolutions/cybersource-nestjs

### Coverage Reports

View coverage at: https://codecov.io/gh/tsee9iii/nestjs-cybersource-rest-client-ts

---

## Troubleshooting

### "npm ERR! 403 Forbidden"

**Cause:** NPM token is invalid or missing

**Fix:**

1. Generate new NPM token
2. Update `NPM_TOKEN` secret in GitHub
3. Re-run workflow

### "npm ERR! You cannot publish over the previously published versions"

**Cause:** Version already exists on NPM

**Fix:**

1. Bump version: `npm version patch`
2. Push changes: `git push origin main --tags`
3. Re-run workflow

### Tests Failing in CI

**Cause:** Code issues or environment differences

**Fix:**

1. Run tests locally: `npm test`
2. Check Node.js version matches CI (18.x or 20.x)
3. Review test output in Actions tab
4. Fix issues and push changes

### Build Failing

**Cause:** TypeScript compilation errors

**Fix:**

1. Run build locally: `npm run build`
2. Fix TypeScript errors
3. Push changes

---

## Best Practices

### 1. Test Before Publishing

Always ensure tests pass locally:

```bash
npm test
npm run build
cd nestjs && npm test && npm run build
```

### 2. Use Semantic Versioning

- Bug fixes → PATCH
- New features → MINOR
- Breaking changes → MAJOR

### 3. Write Changelog

Update CHANGELOG.md before releasing:

```markdown
## [1.1.3] - 2025-10-23

### Added

- Security utilities for safe logging
- ReDoS protection in email validation

### Fixed

- Sensitive data logging in test files
```

### 4. Create Meaningful Releases

Include in GitHub Release notes:

- What's new
- Breaking changes (if any)
- Migration guide (if needed)
- Bug fixes

### 5. Monitor Dependencies

Regularly update dependencies:

```bash
npm outdated
npm update
```

---

## Security Considerations

### Protected Secrets

Never commit these to the repository:

- ❌ NPM tokens
- ❌ GitHub tokens
- ❌ API keys/secrets

Always use GitHub Secrets for sensitive data.

### CodeQL Scanning

Automatic security scanning runs on every push:

- Detects code vulnerabilities
- Identifies security issues
- Suggests fixes

### Dependency Auditing

Runs `npm audit` automatically:

- Checks for known vulnerabilities
- Reports security issues
- Suggests updates

---

## Next Steps

1. ✅ NPM token configured in GitHub Secrets
2. ✅ Test CI/CD by pushing code
3. ✅ Create your first release
4. ✅ Add status badges to README
5. ✅ Set up Codecov (optional)
6. ✅ Configure branch protection rules

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Codecov Documentation](https://docs.codecov.com/)
