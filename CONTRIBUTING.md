# Contributing to Gogetjob Platform

## Welcome! 👋

Thank you for your interest in contributing to Gogetjob! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the work, not the person
- Help others learn and grow
- Report issues constructively
- No harassment, discrimination, or hate speech

## How to Contribute

### 1. Report a Bug 🐛

Found a bug? Help us fix it!

**Before submitting:**
- Check if the issue already exists
- Try to reproduce the bug
- Gather relevant information (browser, OS, steps)

**Submit an issue with:**
```
Title: Brief description of the bug
Description:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (browser, OS, version)
```

### 2. Suggest an Enhancement 💡

Have an idea to improve Gogetjob?

**Submit an enhancement request:**
```
Title: Brief description of the feature
Description:
- Why this feature would be useful
- How it should work
- Possible implementation approaches
- Any related issues or discussions
```

### 3. Submit a Pull Request 🚀

#### Fork the Repository

```bash
# 1. Fork on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/gogetjob-platform.git
cd gogetjob-platform

# 3. Add upstream remote
git remote add upstream https://github.com/kingraymond1232003-lab/gogetjob-platform.git
```

#### Create a Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
```

#### Make Your Changes

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Make your changes
# Test thoroughly
```

#### Code Style

Follow these guidelines:

```javascript
// Use meaningful variable names
const userWalletBalance = 5000;

// Use arrow functions for callbacks
const handleSubmit = (data) => { /* ... */ };

// Add comments for complex logic
// Calculate commission after admin fees
const commission = employerPrice * 0.15;

// Use destructuring
const { email, password } = formData;

// Keep components under 300 lines
// Use custom hooks for complex logic
```

#### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good ✅
git commit -m "Add user profile image upload feature"
git commit -m "Fix withdrawal status not updating on page load"
git commit -m "Refactor admin dashboard to use custom hooks"

# Avoid ❌
git commit -m "Fix stuff"
git commit -m "Update files"
git commit -m "Bug"
```

#### Format: `<type>: <subject>`

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, missing semicolons)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Add or update tests
- `chore:` Maintenance, dependencies

#### Push Your Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

#### Create a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## How to Test
Steps to test the changes:
1. 
2. 

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex areas
- [ ] I have tested locally
- [ ] No new warnings generated
- [ ] Documentation updated if needed
```

## Development Workflow

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/kingraymond1232003-lab/gogetjob-platform.git
cd gogetjob-platform

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev

# In another terminal, start backend (if implementing)
cd ../gogetjob-backend
npm run dev
```

### Testing

```bash
# Run tests (when implemented)
npm test

# Test specific feature
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Linting & Formatting

```bash
# Check code style
npm run lint

# Auto-fix style issues
npm run format
```

## Areas That Need Help

### High Priority 🔴
- [ ] Backend API implementation
- [ ] Database setup and migrations
- [ ] Payment integration (Paystack/Flutterwave)
- [ ] Email notifications
- [ ] Image upload & storage

### Medium Priority 🟡
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation improvements

### Low Priority 🟢
- [ ] UI/UX improvements
- [ ] Additional features
- [ ] Mobile app version
- [ ] Internationalization
- [ ] Accessibility improvements

## Good First Issues

Looking to get started? Check out issues labeled "good first issue":
- Small scope
- Clear requirements
- Great for learning the codebase

## Getting Help

### Questions?
- Check existing issues/discussions
- Read documentation
- Ask in pull request comments
- Create a discussion

### Getting Stuck?
1. Re-read the relevant documentation
2. Search existing issues
3. Create a new issue describing the problem
4. Ask in discussions

## Review Process

1. **Automated Checks**
   - Code style validation
   - Linting
   - Build test

2. **Code Review**
   - At least one maintainer reviews
   - Constructive feedback provided
   - Changes may be requested

3. **Approval & Merge**
   - All checks pass
   - At least one approval
   - Merge to main branch

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Credited in release notes
- Mentioned in project updates
- Invited to join as maintainer (if active)

## Project Structure

```
gogetjob-platform/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   └── App.jsx
├── public/              # Static files
├── docs/                # Documentation
└── package.json
```

## Communication

- **Issues**: Bug reports and features
- **Discussions**: Questions and ideas
- **Pull Requests**: Code changes
- **Email**: For sensitive matters

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Thank You! 🎉

Your contributions make Gogetjob better for everyone. Thank you for being part of this journey!

---

**Happy contributing! Feel free to reach out if you have questions.**
