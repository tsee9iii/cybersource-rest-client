# NPM Publishing Checklist

## Pre-Publishing Checklist

### ✅ One-Time Setup (Do Once)

- [ ] **NPM Account**

  - Create account at https://www.npmjs.com/
  - Verify email address
  - Set up 2FA (recommended)

- [ ] **NPM Token**

  - Generate Automation token at https://www.npmjs.com/settings/[username]/tokens
  - Copy the token (shown only once!)

- [ ] **GitHub Secrets**

  - Go to Repository Settings → Secrets and variables → Actions
  - Add new secret: `NPM_TOKEN` = [your token]

- [ ] **Repository Permissions**

  - Settings → Actions → General
  - Enable "Read and write permissions"
  - Enable "Allow GitHub Actions to create and approve pull requests"

- [ ] **Package Scope** (if using @infinitesolutions)
  - Ensure you have access to the @infinitesolutions organization on NPM
  - Or update package.json to use your own scope/name

---

### ✅ Before Each Release

- [ ] **Tests Pass Locally**

  ```bash
  npm test
  cd nestjs && npm test
  ```

- [ ] **Build Succeeds**

  ```bash
  npm run build
  cd nestjs && npm run build
  ```

- [ ] **No Security Vulnerabilities**

  ```bash
  npm audit
  cd nestjs && npm audit
  ```

- [ ] **Update Version**

  ```bash
  # For NestJS package (most common)
  cd nestjs
  npm version patch  # or minor, or major
  ```

- [ ] **Update CHANGELOG** (if exists)

  - Document new features
  - Document bug fixes
  - Document breaking changes

- [ ] **Commit & Push**
  ```bash
  git add .
  git commit -m "chore: bump version to x.x.x"
  git push origin main --tags
  ```

---

## Publishing Methods

### Method 1: GitHub Release (Automated - Recommended)

1. [ ] Go to https://github.com/tsee9iii/nestjs-cybersource-rest-client-ts/releases
2. [ ] Click "Draft a new release"
3. [ ] Click "Choose a tag" and create new tag (e.g., `v1.1.3`)
4. [ ] Enter release title (e.g., "v1.1.3 - Security Improvements")
5. [ ] Add release notes:

   ```markdown
   ## What's New

   - Added security utilities for safe logging
   - Fixed ReDoS vulnerability in email validation

   ## Bug Fixes

   - Fixed sensitive data logging in test files

   ## Security

   - Addressed CodeQL security warnings
   ```

6. [ ] Click "Publish release"
7. [ ] GitHub Actions will automatically publish to NPM

### Method 2: Manual Workflow

1. [ ] Go to Actions tab
2. [ ] Select "Publish to NPM" workflow
3. [ ] Click "Run workflow"
4. [ ] Select package to publish (usually "nestjs" or "both")
5. [ ] Click "Run workflow" button
6. [ ] Monitor progress in Actions tab

### Method 3: Local Publishing (Not Recommended)

```bash
# Login to NPM (one time)
npm login

# Publish NestJS package
cd nestjs
npm publish --access public

# Publish root package (if needed)
cd ..
npm publish --access public
```

---

## Post-Publishing

- [ ] **Verify on NPM**

  - Check https://www.npmjs.com/package/@infinitesolutions/cybersource-nestjs
  - Verify version number
  - Check that README displays correctly

- [ ] **Test Installation**

  ```bash
  # In a separate directory
  mkdir test-install
  cd test-install
  npm init -y
  npm install @infinitesolutions/cybersource-nestjs
  ```

- [ ] **Update Documentation**

  - Update installation instructions if needed
  - Update version references

- [ ] **Announce Release** (optional)
  - Post on Twitter/LinkedIn
  - Update project website
  - Notify users

---

## Quick Commands Reference

```bash
# Check current version
npm version

# Bump version (creates commit + tag)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Push with tags
git push origin main --tags

# View published versions
npm view @infinitesolutions/cybersource-nestjs versions

# View package info
npm view @infinitesolutions/cybersource-nestjs

# Login to NPM
npm login

# Publish (manual)
npm publish --access public
```

---

## Troubleshooting

### Error: "You cannot publish over the previously published versions"

**Solution:** Bump the version number

```bash
cd nestjs
npm version patch
git push origin main --tags
```

### Error: "403 Forbidden"

**Solutions:**

1. Check NPM token is valid
2. Verify you have publish access to @infinitesolutions scope
3. Re-generate NPM token and update GitHub secret

### Error: "ENEEDAUTH"

**Solution:** Login to NPM

```bash
npm login
```

---

## Version Strategy

| Change Type     | Version Bump | Example       |
| --------------- | ------------ | ------------- |
| Bug fix         | `patch`      | 1.0.0 → 1.0.1 |
| New feature     | `minor`      | 1.0.0 → 1.1.0 |
| Breaking change | `major`      | 1.0.0 → 2.0.0 |
| Security fix    | `patch`      | 1.0.0 → 1.0.1 |
| Documentation   | `patch`      | 1.0.0 → 1.0.1 |

---

## First Time Publishing?

If you haven't published before, run:

```bash
cd nestjs
npm publish --access public
```

This will:

1. Build the package (via `prepublishOnly`)
2. Run tests
3. Publish to NPM registry
4. Make it publicly accessible

After first publish, use GitHub Actions for subsequent releases.
