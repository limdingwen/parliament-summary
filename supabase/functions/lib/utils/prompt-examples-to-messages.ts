export default function promptExamplesToMessages(
  promptExamples: {
    user: string;
    assistant: string;
  }[],
) {
  return promptExamples.flatMap(({ user, assistant }) => [
    { role: "user", content: user },
    { role: "assistant", content: assistant },
  ]);
}
