# Contributing to 104 Auto-Apply

Thank you for considering contributing to this project! Here's how you can help.

## Ways to Contribute

### 1. Report Issues
Found a bug or have a feature request?
- Check if the issue already exists
- Create a detailed issue report with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (OS, Claude Code version, etc.)

### 2. Improve Documentation
- Fix typos or clarify instructions
- Add more usage examples
- Translate documentation to other languages
- Create video tutorials

### 3. Enhance the Code
- Fix bugs
- Add new features
- Improve error handling
- Optimize performance

### 4. Test & Provide Feedback
- Test the skill with different scenarios
- Report edge cases
- Suggest improvements

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/104Skill.git
   cd 104Skill
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make your changes

5. Test thoroughly:
   - Install the skill locally
   - Test with single job applications
   - Test with batch processing
   - Verify error handling

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- Add JSDoc comments for functions
- Handle errors gracefully
- Use meaningful variable names

### Documentation
- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Follow existing formatting

## Commit Guidelines

Write clear commit messages:
```
feat: Add support for multiple cover letters
fix: Handle network timeout errors
docs: Update installation instructions
style: Format code consistently
refactor: Simplify job filtering logic
test: Add unit tests for applyToJob function
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build process, dependencies, etc.

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description:
   - What changes were made
   - Why these changes are needed
   - How to test the changes

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots to show the change

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

## Code of Conduct

### Our Pledge
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug?** Create an Issue
- **Feature idea?** Start a Discussion first

## Testing Guidelines

### Manual Testing
Before submitting a PR:
1. Install the skill from your branch
2. Test single job application
3. Test batch processing (2-3 pages)
4. Test error scenarios:
   - No internet connection
   - Already applied jobs
   - Missing cover letter
   - Invalid credentials

### Automated Testing (Future)
We plan to add:
- Unit tests for core functions
- Integration tests for automation flow
- E2E tests with Playwright

## Website Development

To work on the GitHub Pages site:

1. Edit files in `docs/`:
   - `index.html` - Page content
   - `styles.css` - Styling
   - `script.js` - Interactive features

2. Test locally:
   ```bash
   cd docs
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. Push changes to trigger GitHub Actions deployment

### Design Guidelines
- Use blue/green/teal colors (NO PURPLE)
- Maintain responsive design
- Ensure accessibility (WCAG 2.1)
- Optimize for performance
- Test on mobile devices

## Legal

### License
By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

### Copyright
You retain copyright of your contributions, but grant the project permission to use them.

### Contributor Agreement
- You have the right to submit the work
- The work is original or properly attributed
- You grant us a perpetual, worldwide, non-exclusive license to use your contribution

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the documentation

## Questions?

Feel free to reach out by:
- Opening an issue
- Starting a discussion
- Contacting maintainers

Thank you for contributing! 🎉
