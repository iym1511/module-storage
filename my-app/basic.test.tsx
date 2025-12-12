import {render, screen} from "@testing-library/react";

function Dummy() {
    return <div>Hello Test</div>;
}

test("Vitest + RTL 정상 동작 확인", () => {
    render(<Dummy />);
    expect(screen.getByText("Hello Test")).toBeInTheDocument();
});
