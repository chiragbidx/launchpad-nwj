import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={["border rounded px-2 py-1 mt-1 resize-y", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export { Textarea };