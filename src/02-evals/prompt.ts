/** The prompt under test. Change it here, then re-run the eval to compare scores. */
export function buildPrompt(goal: string): string {
  return `Create a one-day meal plan for the person described inside <goal> tags.

<goal>
${goal}
</goal>`;
}
