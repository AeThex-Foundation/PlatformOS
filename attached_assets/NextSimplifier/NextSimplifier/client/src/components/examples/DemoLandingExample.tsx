import DemoLanding from "../passport/DemoLanding";

export default function DemoLandingExample() {
  return (
    <DemoLanding
      onSelectMode={(mode) => {
        console.log(`Selected mode: ${mode}`);
      }}
    />
  );
}
