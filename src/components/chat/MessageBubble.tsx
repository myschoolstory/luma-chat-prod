import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
interface MessageBubbleProps {
  sender: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}
export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, timestamp, isSelf }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex flex-col mb-3 max-w-[85%] sm:max-w-[75%]",
        isSelf ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className={cn(
        "flex items-center gap-2 mb-1 px-1.5",
        isSelf ? "flex-row-reverse" : "flex-row"
      )}>
        {!isSelf && (
          <span className="text-xs font-semibold text-foreground/80 tracking-tight">
            {sender}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground/60 tabular-nums">
          {format(timestamp, 'HH:mm')}
        </span>
      </div>
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm border transition-shadow",
          isSelf
            ? "bg-indigo-600 text-white border-indigo-500/50 rounded-tr-none shadow-indigo-200/20"
            : "bg-secondary text-secondary-foreground border-border rounded-tl-none"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-pretty overflow-hidden">
          {text}
        </p>
      </div>
    </motion.div>
  );
};