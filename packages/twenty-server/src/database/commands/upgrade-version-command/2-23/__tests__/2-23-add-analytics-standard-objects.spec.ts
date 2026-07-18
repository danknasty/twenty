import { readFileSync } from 'fs';
import { join } from 'path';

const COMMAND_FILE = join(
  __dirname,
  '../2-23-workspace-command-1803000000000-add-analytics-standard-objects.command.ts',
);

describe('2-23 Add Analytics Standard Objects Upgrade Command', () => {
  it('should have @RegisteredWorkspaceCommand decorator with version 2.23.0 and timestamp 1803000000000', () => {
    const content = readFileSync(COMMAND_FILE, 'utf-8');

    // Verify the decorator is present with the correct arguments
    expect(content).toContain(
      "@RegisteredWorkspaceCommand('2.23.0', 1803000000000)",
    );
  });

  it('should have @Command decorator with the correct name', () => {
    const content = readFileSync(COMMAND_FILE, 'utf-8');

    expect(content).toContain(
      'name: \'upgrade:2-23:add-analytics-standard-objects\'',
    );
  });

  it('should export AddAnalyticsStandardObjectsCommand class', () => {
    const content = readFileSync(COMMAND_FILE, 'utf-8');

    // Verify the class is exported
    expect(content).toContain(
      'export class AddAnalyticsStandardObjectsCommand',
    );
  });

  it('should be importable in the upgrade version command module', () => {
    const MODULE_FILE = join(
      __dirname,
      '../2-23-upgrade-version-command.module.ts',
    );
    const content = readFileSync(MODULE_FILE, 'utf-8');

    // Verify the module imports the command
    expect(content).toContain(
      'AddAnalyticsStandardObjectsCommand',
    );

    // Verify it's in the providers array
    const providersMatch = content.match(/providers:\s*\[([\s\S]*?)\]/);
    expect(providersMatch).not.toBeNull();
    expect(providersMatch![1]).toContain('AddAnalyticsStandardObjectsCommand');
  });
});
