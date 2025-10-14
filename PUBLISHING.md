# Publishing Guide

## Publishing the Main Package

1. **Login to npm:**

```bash
npm login
```

2. **Verify package details:**

```bash
npm pack --dry-run
```

3. **Publish the main package:**

```bash
npm publish
```

## Publishing the NestJS Module

1. **Navigate to the nestjs directory:**

```bash
cd nestjs
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the module:**

```bash
npm run build
```

4. **Publish the NestJS module:**

```bash
npm publish
```

## Usage After Publishing

### Installing the Main Package

```bash
npm install @tsee9iii/cybersource-rest-client
```

### Installing the NestJS Module

```bash
npm install @tsee9iii/cybersource-nestjs @tsee9iii/cybersource-rest-client
```

## Pre-publish Checklist

- [ ] Update version number in package.json
- [ ] Test the package locally using `npm link`
- [ ] Ensure README is up to date
- [ ] Verify all files are included in package.json "files" array
- [ ] Check that dependencies are correctly specified
- [ ] Run any tests if available
- [ ] Ensure TypeScript types are properly exported

## Notes

- The main package exports TypeScript source directly to avoid compilation issues
- The NestJS module has the main package as a dependency
- Both packages are set to public access for npm publishing
