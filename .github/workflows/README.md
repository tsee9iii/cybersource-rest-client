# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the CyberSource REST Client packages.

## Workflows

### 📋 ci.yml - Continuous Integration

**Triggers:** Push to main/develop, Pull Requests

**What it does:**

- ✅ Runs tests on Node.js 18.x and 20.x
- ✅ Generates code coverage reports
- ✅ Performs security scans (CodeQL)
- ✅ Checks for vulnerabilities (npm audit)
- ✅ Builds both packages

### 🚀 publish.yml - NPM Publishing

**Triggers:** GitHub Release, Manual dispatch

**What it does:**

- ✅ Publishes root package to NPM
- ✅ Publishes NestJS package to NPM
- ✅ Attaches build artifacts to releases

**Manual Options:**

- Publish root only
- Publish nestjs only
- Publish both packages

### 🔢 version-bump.yml - Version Management

**Triggers:** Manual dispatch only

**What it does:**

- ✅ Bumps package version (patch/minor/major)
- ✅ Updates package.json
- ✅ Creates git commit and tag
- ✅ Pushes changes to repository

## Quick Start

1. **Set up NPM token:**

   - Repository Settings → Secrets → Add `NPM_TOKEN`

2. **Enable workflow permissions:**

   - Settings → Actions → General → Read/write permissions

3. **Test locally:**

   ```bash
   npm test
   npm run build
   ```

4. **Publish:**
   - Create a GitHub Release, or
   - Run "Publish to NPM" workflow manually

## Documentation

See [CI-CD-GUIDE.md](../../CI-CD-GUIDE.md) for complete setup instructions.
