import {
  shouldAskFollowUp,
  pickFollowUp,
  generateAdvancedFeedback,
  analyzeAnswer,
  getFeedbackStats
} from '../utils/questionUtils';

describe('QuestionUtils', () => {
  describe('shouldAskFollowUp', () => {
    test('returns false for empty answer', () => {
      expect(shouldAskFollowUp('')).toBe(false);
      expect(shouldAskFollowUp(null)).toBe(false);
      expect(shouldAskFollowUp(undefined)).toBe(false);
    });

    test('returns false for short answers', () => {
      const shortAnswer = 'This is a short answer.';
      expect(shouldAskFollowUp(shortAnswer, 20)).toBe(false);
    });

    test('returns true for long answers with default probability', () => {
      const longAnswer = 'This is a very long answer with many words that should trigger a follow-up question because it exceeds the minimum word count and the random probability check passes.';
      // Mock Math.random to return 0.5 (within probability range)
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5);
      expect(shouldAskFollowUp(longAnswer)).toBe(true);
      Math.random = originalRandom;
    });

    test('returns false when random check fails', () => {
      const longAnswer = 'This is a very long answer with many words that should trigger a follow-up question.';
      // Mock Math.random to return 0.8 (outside probability range of 0.6)
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.8);
      expect(shouldAskFollowUp(longAnswer, 20, 0.6)).toBe(false);
      Math.random = originalRandom;
    });

    test('respects custom parameters', () => {
      const mediumAnswer = 'This is a medium length answer with several words.';
      expect(shouldAskFollowUp(mediumAnswer, 5, 1.0)).toBe(true);
    });
  });

  describe('pickFollowUp', () => {
    const followUps = [
      'Tell me about a challenge you faced.',
      'How did you work with your team?',
      'What was your goal?',
      'How did you solve the problem?',
      'How did you solve the problem?',
      '?',
      'How did you demonstrate leadership?'
    ];

    test('returns empty string for empty followUps array', () => {
      expect(pickFollowUp('Some answer', [])).toBe('');
      expect(pickFollowUp('Some answer', null)).toBe('');
    });

    test('returns the single follow-up when only one exists', () => {
      const singleFollowUp = ['Only one question'];
      expect(pickFollowUp('Some answer', singleFollowUp)).toBe('Only one question');
    });

    test('prioritizes challenge-related follow-ups', () => {
      const answer = 'I faced a big challenge in my project.';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('Tell me about a challenge you faced.');
    });

    test('prioritizes team-related follow-ups', () => {
      const answer = 'I worked closely with my team members.';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('How did you work with your team?');
    });

    test('prioritizes goal-related follow-ups', () => {
      const answer = 'My main goal was to improve performance.';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('What was your goal?');
    });

    test('prioritizes problem-related follow-ups', () => {
      const answer = 'I solved a complex problem.';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('How did you solve the problem?');
    });

    test('prioritizes technical-related follow-ups', () => {
      const answer = 'I used technical skills to implement the solution.?';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('?');
    });

    test('prioritizes leadership-related follow-ups', () => {
      const answer = 'I demonstrated leadership in the project.';
      const result = pickFollowUp(answer, followUps);
      expect(result).toBe('How did you demonstrate leadership?');
    });

    test('returns random follow-up when no priority matches', () => {
      const answer = 'This is a generic answer without specific keywords.';
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.1); // This will select index 0
      const result = pickFollowUp(answer, followUps);
      expect(followUps).toContain(result);
      Math.random = originalRandom;
    });
  });

  describe('generateAdvancedFeedback', () => {
    test('returns default message for empty answer', () => {
      expect(generateAdvancedFeedback('')).toBe('Please provide an answer to receive feedback.');
      expect(generateAdvancedFeedback(null)).toBe('Please provide an answer to receive feedback.');
    });

    test('provides feedback for short answers', () => {
      const shortAnswer = 'I worked on a project.';
      const feedback = generateAdvancedFeedback(shortAnswer);
      expect(feedback).toContain('Good start!');
      expect(feedback).toContain('elaborate with specific examples');
    });

    test('provides feedback for medium answers', () => {
      const mediumAnswer = 'I worked on a project where I developed a new feature. It was challenging but I learned a lot from it.';
      const feedback = generateAdvancedFeedback(mediumAnswer);
      expect(feedback).toContain('Solid answer!');
    });

    test('provides feedback for detailed answers', () => {
      const detailedAnswer = 'I worked on a complex project where I led a team of 5 developers to build a scalable web application. We faced several challenges including performance issues and tight deadlines. I implemented several optimizations that improved response time by 40%. The project was delivered on time and received positive feedback from stakeholders. This experience taught me valuable lessons about leadership, technical problem-solving, and team collaboration.';
      const feedback = generateAdvancedFeedback(detailedAnswer);
      expect(feedback).toContain('🌟 Outstanding! Comprehensive and detailed answer. Great use of action-oriented language!');
    });

    test('provides outstanding feedback for comprehensive answers', () => {
      const comprehensiveAnswer = 'I have extensive experience in software development. Over the past 5 years, I have worked on multiple projects including a large-scale e-commerce platform that served millions of users. I led cross-functional teams, implemented microservices architecture, and improved system performance by 60%. I have strong expertise in React, Node.js, and cloud technologies. I have mentored junior developers and contributed to open-source projects. My technical skills include algorithm optimization, database design, and DevOps practices. I have successfully delivered projects under tight deadlines while maintaining high code quality standards.';
      const feedback = generateAdvancedFeedback(comprehensiveAnswer);
      expect(feedback).toContain('Outstanding!');
    });

    test('suggests adding examples when missing', () => {
      const answerWithoutExamples = 'I have experience with React development.';
      const feedback = generateAdvancedFeedback(answerWithoutExamples);
      expect(feedback).toContain('🔍 Good start! Try to elaborate with specific examples.');
    });

    test('suggests adding metrics when missing', () => {
      const answerWithoutMetrics = 'I improved the application performance.';
      const feedback = generateAdvancedFeedback(answerWithoutMetrics);
      expect(feedback).toContain('numbers to quantify achievements');
    });

    test('recognizes good use of action verbs', () => {
      const answerWithActionVerbs = 'I developed a new feature, implemented optimizations, and delivered the project successfully.';
      const feedback = generateAdvancedFeedback(answerWithActionVerbs);
      expect(feedback).toContain('action-oriented language');
    });

    test('provides question-specific feedback for introduction questions', () => {
      const question = 'Tell me about yourself';
      const answer = 'I am a software developer with 3 years of experience.';
      const feedback = generateAdvancedFeedback(answer, question);
      expect(feedback).toContain('Excellent introduction!');
    });

    test('provides question-specific feedback for project questions', () => {
      const question = 'Describe a project you worked on';
      const answer = 'I built a web application using React.';
      const feedback = generateAdvancedFeedback(answer, question);
      expect(feedback).toContain('Strong project explanation!');
    });

    test('provides question-specific feedback for team questions', () => {
      const question = 'How do you work in a team?';
      const answer = 'I collaborate well with others.';
      const feedback = generateAdvancedFeedback(answer, question);
      expect(feedback).toContain('Great teamwork example!');
    });

    test('provides question-specific feedback for technical questions', () => {
      const question = 'Explain a technical concept';
      const answer = 'JavaScript is a programming language.';
      const feedback = generateAdvancedFeedback(answer, question);
      expect(feedback).toContain('Solid technical depth!');
    });
  });

  describe('analyzeAnswer', () => {
    test('analyzes empty answer', () => {
      const analysis = analyzeAnswer('');
      expect(analysis.wordCount).toBe(1); // Empty string split gives 1 empty string
      expect(analysis.sentenceCount).toBe(1);
      expect(analysis.hasExamples).toBe(false);
    });

    test('analyzes simple answer', () => {
      const answer = 'I have experience with React.';
      const analysis = analyzeAnswer(answer);
      expect(analysis.wordCount).toBe(5);
      expect(analysis.sentenceCount).toBe(1);
      expect(analysis.hasExamples).toBe(false);
      expect(analysis.hasActionVerbs).toBe(false);
    });

    test('analyzes complex answer with examples and metrics', () => {
      const answer = 'I developed a project that improved performance by 50%. For example, I optimized the database queries and implemented caching a';
      const analysis = analyzeAnswer(answer);
      expect(analysis.wordCount).toBe(20);
      expect(analysis.sentenceCount).toBe(2);
      expect(analysis.hasExamples).toBe(true);
      expect(analysis.hasMetrics).toBe(true);
      expect(analysis.hasActionVerbs).toBe(true);
    });

    test('calculates average sentence length', () => {
      const answer = 'calculates it';
      const analysis = analyzeAnswer(answer);
      expect(analysis.sentenceCount).toBe(2);
      expect(analysis.avgSentenceLength).toBeCloseTo(7.5); // (2 + 11) / 2
    });
  });

  describe('getFeedbackStats', () => {
    test('returns comprehensive stats', () => {
      const answer = 'I developed a React application that improved user experience.';
      const question = 'Describe a project you worked on';
      const stats = getFeedbackStats(answer, question);

      expect(stats).toHaveProperty('analysis');
      expect(stats).toHaveProperty('feedback');
      expect(stats).toHaveProperty('wordCount');
      expect(stats).toHaveProperty('sentenceCount');
      expect(stats.wordCount).toBe(9);
      expect(stats.sentenceCount).toBe(1);
      expect(stats.feedback).toContain('Strong project explanation!');
    });
  });
});
