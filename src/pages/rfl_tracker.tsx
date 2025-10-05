import { useState } from "react";
import {
  Calendar,
  Plus,
  TrendingDown,
  Target,
  UtensilsCrossed,
  Dumbbell,
  BarChart3,
  BookOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface JournalEntry {
  date: string;
  weight: string;
  protein: string;
  exerciseType: string;
  exerciseIntensity: string;
  notes: string;
}

export default function RFLDietJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentPage, setCurrentPage] = useState("journal");

  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    protein: "",
    exerciseType: "",
    exerciseIntensity: "",
    notes: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    const existingIndex = entries.findIndex(
      (entry) => entry.date === currentEntry.date,
    );

    if (existingIndex >= 0) {
      const updated = [...entries];
      updated[existingIndex] = currentEntry;
      setEntries(updated);
    } else {
      setEntries(
        [currentEntry, ...entries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    }

    setCurrentEntry({
      date: new Date().toISOString().split("T")[0],
      weight: "",
      protein: "",
      exerciseType: "",
      exerciseIntensity: "",
      notes: "",
    });
    setShowForm(false);
  };

  const handleEdit = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (date: string) => {
    setEntries(entries.filter((entry) => entry.date !== date));
  };

  const getWeightTrend = () => {
    if (entries.length < 2) return null;
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const recent = sorted.slice(-7).filter((e) => e.weight);
    if (recent.length < 2) return null;
    const change = parseFloat(recent[recent.length - 1].weight) - parseFloat(recent[0].weight);
    return change;
  };

  const getChartData = () => {
    return [...entries]
      .filter((e) => e.weight || e.protein)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: e.weight ? parseFloat(e.weight) : null,
        protein: e.protein ? parseFloat(e.protein) : null,
      }));
  };

  const getExerciseData = () => {
    return [...entries]
      .filter((e) => e.exerciseType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        type: e.exerciseType,
        intensity:
          e.exerciseIntensity === "Low"
            ? 1
            : e.exerciseIntensity === "Medium"
              ? 2
              : e.exerciseIntensity === "High"
                ? 3
                : 0,
      }));
  };

  const weightTrend = getWeightTrend();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">RFL Diet Journal</h1>
          <p className="text-blue-100 text-sm">
            Track your Rapid Fat Loss progress
          </p>

          {weightTrend !== null && currentPage === "journal" && (
            <div className="mt-4 bg-white/10 rounded-lg p-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm">
                7-day trend: {weightTrend > 0 ? "+" : ""}
                {weightTrend.toFixed(1)} lbs
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setCurrentPage("journal")}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              currentPage === "journal"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Journal
          </button>
          <button
            onClick={() => setCurrentPage("analytics")}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              currentPage === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {currentPage === "journal" && (
          <>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 shadow-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "New Entry"}
            </button>

            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={currentEntry.date}
                      onChange={(e) =>
                        setCurrentEntry({
                          ...currentEntry,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.weight}
                        onChange={(e) =>
                          setCurrentEntry({
                            ...currentEntry,
                            weight: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="150.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={currentEntry.protein}
                        onChange={(e) =>
                          setCurrentEntry({
                            ...currentEntry,
                            protein: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      Exercise
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={currentEntry.exerciseType}
                          onChange={(e) =>
                            setCurrentEntry({
                              ...currentEntry,
                              exerciseType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">None</option>
                          <option value="Resistance">Resistance</option>
                          <option value="Cardio">Cardio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Intensity
                        </label>
                        <select
                          value={currentEntry.exerciseIntensity}
                          onChange={(e) =>
                            setCurrentEntry({
                              ...currentEntry,
                              exerciseIntensity: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!currentEntry.exerciseType}
                        >
                          <option value="">Select</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={currentEntry.notes}
                      onChange={(e) =>
                        setCurrentEntry({
                          ...currentEntry,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="How are you feeling? Energy levels? Hunger?"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {entries.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No entries yet. Start tracking your RFL journey!</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.date}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {new Date(
                            entry.date + "T00:00:00",
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        {entry.exerciseType && (
                          <div className="flex gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                entry.exerciseType === "Resistance"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {entry.exerciseType} - {entry.exerciseIntensity}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.date)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      {entry.weight && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            <strong>{entry.weight}</strong> lbs
                          </span>
                        </div>
                      )}
                      {entry.protein && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <UtensilsCrossed className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            <strong>{entry.protein}g</strong> protein
                          </span>
                        </div>
                      )}
                    </div>

                    {entry.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {currentPage === "analytics" && (
          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No data yet. Add some entries to see your analytics!</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Weight Progress
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                      <YAxis style={{ fontSize: "12px" }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                        name="Weight (lbs)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Protein Intake
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                      <YAxis style={{ fontSize: "12px" }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="protein"
                        fill="#10b981"
                        name="Protein (g)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {getExerciseData().length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Exercise Activity
                    </h2>
                    <div className="space-y-2">
                      {getExerciseData().map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">{ex.date}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                ex.type === "Resistance"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {ex.type}
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 3].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-4 rounded ${
                                    level <= ex.intensity
                                      ? "bg-blue-600"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
