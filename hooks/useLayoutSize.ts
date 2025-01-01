import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

export default function useLayoutSize(padding: number): {
    layoutSize: LayoutSize,
    handleLayout: (event: LayoutChangeEvent) => void
} {
    const [layoutSize, setLayoutSize] = useState<LayoutSize>({
        height: 0,
        width: 0
    })
    const handleLayout = (event: LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
        setLayoutSize({ 
            height: Math.max(height - 2 * padding, 0), 
            width: Math.max(width - 2 * padding, 0)
        });
    };

    return { layoutSize, handleLayout };
}