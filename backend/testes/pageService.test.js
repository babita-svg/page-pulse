const { parsePage } = require('../services/pageService');

describe('pageService - Parsing Logic Tests', () => {
  // 1. Happy Path
  test('Happy Path: Correctly parses valid HTML content', () => {
    const mockHtml = `
      <html>
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="This is a test meta description." />
        </head>
        <body>
          <h1>Header 1</h1>
          <h1>Header 2</h1>
          <img src="test1.jpg" alt="Logo" />
          <img src="test2.jpg" />
          <p>Hello world, this is a test page with standard text content.</p>
        </body>
      </html>
    `;

    const result = parsePage(mockHtml);

    expect(result.title).toBe('Test Page Title');
    expect(result.metaDescription).toBe('This is a test meta description.');
    expect(result.h1Count).toBe(2);
    expect(result.imagesMissingAlt).toBe(1);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  // 2. Failure Case 1: Empty / Invalid Input
  test('Failure Case 1: Handles empty input gracefully without crashing', () => {
    const result = parsePage('');

    expect(result.title).toBe('No title');
    expect(result.metaDescription).toBe('No meta description');
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  // 3. Failure Case 2: Missing HTML Tags
  test('Failure Case 2: Handles plain text/HTML missing standard metadata tags', () => {
    const mockHtml = '<div>Just a plain div without title or meta tags</div>';
    const result = parsePage(mockHtml);

    expect(result.title).toBe('No title');
    expect(result.metaDescription).toBe('No meta description');
    expect(result.h1Count).toBe(0);
  });
});