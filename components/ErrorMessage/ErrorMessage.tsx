
export default function ErrorMessage({message}: {message: string}) {
  return <div data-testid={'errorMessage'}>{message}</div>;
}