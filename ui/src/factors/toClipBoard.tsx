
export default function ToClipboard(value: string) {
  navigator.clipboard.writeText(value);
}