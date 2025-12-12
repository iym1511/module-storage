import {render, screen} from "@testing-library/react";
import ScrollDrawer from "./ScrollDrawer";

// jsdom 환경에서 window.innerHeight mock
Object.defineProperty(window, "innerHeight", {
    writable: true,
    value: 800,
});

describe("ScrollDrawer", () => {
    test("children이 없으면 emptyMessage가 렌더링된다", () => {
        render(<ScrollDrawer>{[]}</ScrollDrawer>);

        expect(screen.getByText("표시할 내역이 없습니다.")).toBeInTheDocument();
    });

    test("children이 있으면 정상적으로 렌더링된다", () => {
        render(
            <ScrollDrawer>
                <div>테스트 콘텐츠</div>
            </ScrollDrawer>
        );

        expect(screen.getByText("테스트 콘텐츠")).toBeInTheDocument();
    });
});
