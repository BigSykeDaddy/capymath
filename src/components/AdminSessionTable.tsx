'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import React from 'react'


type SessionWithDetails = {
  id: string
  user: {
    name: string | null
    role: string
  }
  mode: string
  startedAt: string
  completedAt: string | null
  problems: {
    question: string
    userAnswer: string
    correct: boolean
    timeMs: number
    round: number
  }[]
}

export default function AdminSessionsTable() {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([])
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error('Failed to load sessions', err))
  }, [])

  function getAccuracy(problems: SessionWithDetails['problems']) {
    const correct = problems.filter(p => p.correct).length
    return problems.length > 0 ? `${Math.round((correct / problems.length) * 100)}%` : '—'
  }

  function getDuration(session: SessionWithDetails) {
    if (!session.completedAt) return 'In Progress'
    const start = new Date(session.startedAt)
    const end = new Date(session.completedAt)
    const mins = ((end.getTime() - start.getTime()) / 60000).toFixed(1)
    return `${mins} min`
  }

  function formatDate(dateStr: string) {
    return format(new Date(dateStr), 'M/d/yyyy, h:mm:ss a')
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white rounded shadow">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="py-2 px-4">Child</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Mode</th>
            <th className="py-2 px-4"># Problems</th>
            <th className="py-2 px-4">Correct %</th>
            <th className="py-2 px-4">Duration</th>
            <th className="py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <React.Fragment key={session.id}>
              <tr
                onClick={() =>
                  setExpandedSessionId(prev =>
                    prev === session.id ? null : session.id
                  )
                }
                className="cursor-pointer border-t hover:bg-yellow-50 transition"
              >
                <td className="py-2 px-4">{session.user.name ?? '—'}</td>
                <td className="py-2 px-4 capitalize">{session.user.role}</td>
                <td className="py-2 px-4 capitalize">{session.mode}</td>
                <td className="py-2 px-4">{session.problems.length}</td>
                <td className="py-2 px-4">{getAccuracy(session.problems)}</td>
                <td className="py-2 px-4">{getDuration(session)}</td>
                <td className="py-2 px-4">{formatDate(session.startedAt)}</td>
              </tr>

              {expandedSessionId === session.id && (
                <tr className="bg-gray-50 border-b">
                  <td colSpan={7} className="p-4">
                    <table className="w-full text-sm border rounded">
                      <thead>
                        <tr className="text-gray-600 bg-gray-100 border-b">
                          <th className="text-left py-1 px-2">Question</th>
                          <th className="text-left py-1 px-2">Answer</th>
                          <th className="text-left py-1 px-2">Correct</th>
                          <th className="text-left py-1 px-2">Round</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.problems.map((p, i) => (
                          <tr
                            key={i}
                            className={
                              p.correct
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }
                          >
                            <td className="py-1 px-2">{p.question}</td>
                            <td className="py-1 px-2">{p.userAnswer}</td>
                            <td className="py-1 px-2">{p.correct ? 'Yes' : 'No'}</td>
                            <td className="py-1 px-2">{p.round}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}

          {sessions.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                No sessions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
