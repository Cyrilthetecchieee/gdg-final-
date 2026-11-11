import type { AgendaSession } from "@/lib/schemas";
import { formatSessionTime } from "@/lib/format";

export function SimpleAgenda({ sessions }: { sessions: AgendaSession[] }) {
  return (
    <section aria-labelledby="agenda-heading" className="mx-auto max-w-4xl">
      <h1 id="agenda-heading" className="text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
        Agenda
      </h1>

      <ol className="mt-8 space-y-3">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="grid gap-1 border-b border-paper/10 pb-3 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <time
              dateTime={session.start}
              className="text-sm font-medium tabular-nums text-paper/60 sm:text-base"
            >
              {formatSessionTime(session.start)}–{formatSessionTime(session.end)}
            </time>
            <span className="text-base leading-relaxed text-paper sm:text-lg">{session.title}</span>
          </li>
        ))}
      </ol>

      <dl className="mt-10 space-y-3 border-t border-paper/10 pt-6 text-base text-paper sm:text-lg">
        <div className="flex gap-3">
          <dt className="font-semibold">Date:</dt>
          <dd>12 December 2026</dd>
        </div>
        <div className="flex gap-3">
          <dt className="font-semibold">Venue:</dt>
          <dd>To be announced</dd>
        </div>
      </dl>
    </section>
  );
}
