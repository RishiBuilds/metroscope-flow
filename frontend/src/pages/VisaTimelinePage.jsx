import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, Button, useToast } from "../components/ui.jsx";
import { getVisaTimeline, updateVisaTimeline } from "../api/tools.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function VisaTimelinePage() {
  const [timeline, setTimeline] = useState(undefined);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    getVisaTimeline()
      .then((r) => setTimeline(r.data.data))
      .catch(() => setTimeline(null));
  }, []);

  const save = async (phases) => {
    setTimeline((t) => ({
      ...t,
      phases,
    }));

    try {
      await updateVisaTimeline(user.id || user._id, phases);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (timeline === undefined) {
    return (
      <main className="p-10 text-center">
        Loading your roadmap…
      </main>
    );
  }

  if (!timeline) {
    return (
      <main className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-extrabold">
          Your Visa Timeline
        </h1>

        <p className="text-surface-500 mt-4">
          Save a Visa Predictor result first, then we'll build your
          personal relocation roadmap.
        </p>

        <Link
          className="btn-primary mt-6"
          to="/visa-predictor"
        >
          Complete Visa Predictor
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">
        Visa <span className="gradient-text">Timeline</span>
      </h1>

      <p className="text-surface-500 mt-2">
        Your saved, step-by-step relocation roadmap.
      </p>

      <div className="mt-8 space-y-4">
        {timeline.phases.map((phase, index) => (
          <Card
            key={phase.id}
            className="p-5 border-l-4 border-l-brand-400"
          >
            <div className="flex justify-between gap-3">
              <div>
                <span className="text-brand-400 font-extrabold">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h2 className="font-bold text-lg">
                  {phase.name}
                </h2>

                <p className="text-sm text-surface-500">
                  Estimated: {phase.duration}
                </p>
              </div>

              <select
                className="input-base h-10 w-32 text-xs"
                value={phase.status}
                onChange={(e) =>
                  save(
                    timeline.phases.map((p) =>
                      p.id === phase.id
                        ? {
                            ...p,
                            status: e.target.value,
                          }
                        : p
                    )
                  )
                }
              >
                {["Not Started", "In Progress", "Done"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-2">
              {phase.substeps.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) =>
                      save(
                        timeline.phases.map((p) =>
                          p.id !== phase.id
                            ? p
                            : {
                                ...p,
                                substeps: p.substeps.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        done: e.target.checked,
                                      }
                                    : i
                                ),
                              }
                        )
                      )
                    }
                  />

                  {item.text}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}