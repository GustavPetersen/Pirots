import { useEffect, useRef } from "react";
import type { Application } from "pixi.js";
import createBoard from "../game/board";
import { useQueryClient } from "@tanstack/react-query";

function Game() {
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        let app: Application | undefined;
        let cancelled = false;

        createBoard(containerRef.current!, queryClient).then((a) => {
            if (cancelled) {
                a.destroy(true, { children: true });
            } else {
                app = a;
            }
        }).catch((err) => console.error("createBoard failed:", err));

        return () => {
            cancelled = true;
            app?.destroy(true, { children: true });
        };
    }, []);

    return <div ref={containerRef} />;
}

export default Game;
