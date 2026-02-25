# Changelog

All notable changes to the 104 Job Auto-Apply skill will be documented in this file.

## [1.0.0] - 2026-02-25

### Added
- Initial release of 104 Job Auto-Apply skill for Claude Code
- Single job application mode for testing
- Batch automation mode for multi-page processing
- Automatic detection and skipping of already applied jobs
- Configurable delays between applications (2-4 seconds default)
- Error handling for each job application
- Detailed console logging and progress tracking
- Cover letter selection support
- Safety features:
  - Random delays to avoid detection
  - Maximum page limit
  - Job filtering (skips closed/unavailable positions)
- Installation script for easy setup
- Comprehensive documentation:
  - SKILL.md: Complete skill implementation
  - README.md: Overview and installation guide
  - USAGE_EXAMPLES.md: Practical usage examples
  - CHANGELOG.md: Version history

### Configuration Options
- `startPage`: Starting page number (default: 1)
- `maxPages`: Maximum pages to process (default: 5)
- `delayMin`: Minimum delay between jobs in ms (default: 2000)
- `delayMax`: Maximum delay between jobs in ms (default: 4000)
- `coverLetter`: Cover letter name (default: '自訂推薦信1')

### Known Limitations
- Cannot handle CAPTCHA challenges
- Cannot handle custom application forms
- Requires manual login before starting
- Browser must remain open during execution
- Cannot handle jobs requiring additional information

### References
- Based on automation scripts from `/Users/jerryliu/ai_experiment/104/`
- Implements Playwright MCP browser automation
- Designed for 104.com.tw job platform

---

## Future Enhancements (Planned)

### [1.1.0] - Planned
- [ ] Add support for multiple search queries
- [ ] Implement pause/resume controls
- [ ] Add visual status indicator
- [ ] Support for saving/loading configuration presets
- [ ] Export application results to JSON/CSV

### [1.2.0] - Planned
- [ ] Add job filtering by salary range
- [ ] Support for company blacklist/whitelist
- [ ] Smart retry logic for failed applications
- [ ] Integration with calendar for tracking interviews
- [ ] Email notifications for successful applications

### [2.0.0] - Planned
- [ ] Support for other job platforms (1111, yes123)
- [ ] AI-powered job matching recommendations
- [ ] Automatic cover letter customization
- [ ] Interview scheduling assistant
- [ ] Application analytics dashboard

---

## Version History Format

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
