'use client';
import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyState {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState: React.FC<EmptyState> = ({
    title = "Looks like you don't have any favorites yet.",
    subtitle = "Try looking for a room that matches your exquisite taste.",
    showReset
}) => {
    const router = useRouter();
    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading center title={title} subtitle={subtitle}/>
            <div className="w-48 mt-4">
                {showReset && (
                    <Button outline label="See All Rooms" onClick={() => router.push('/')}/>
                )}
            </div>
        </div>
    );
}

export default EmptyState;