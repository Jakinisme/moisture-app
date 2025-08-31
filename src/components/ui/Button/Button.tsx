import React from "react";
import  useIntersectionObserver  from "../../../hooks/intersectionObserver";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    to?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
    const {children, className, type, onClick} = props;
    const { ref, isIntersecting } = useIntersectionObserver<HTMLButtonElement>({
        threshold: 0.1,
        rootMargin: '20px'
    });

    return (
        <button 
            ref={ref}
            className={`${className} ${isIntersecting ? 'animate-fade-in' : 'opacity-0'}`}
            type={type}
            onClick={onClick}
            style={{
                transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            {children}
        </button>
    )
}

export default Button;