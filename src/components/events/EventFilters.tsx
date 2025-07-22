'use client';
import { useMemo, useState } from 'react';
import { useEventContext } from '@/context/EventContext';
import EventModal from './EventModal';
import { Event } from '@/types/event';
import { useSearchParams, useRouter } from 'next/navigation';
import EventTable from './EventTable';

export default function EventFilter() {
  const { events } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get('search')?.toLowerCase() || '';
  const typeFilter = searchParams.get('type') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || 'asc';
  const startDateParam = searchParams.get('startDate') || '';
  const endDateParam = searchParams.get('endDate') || '';

  const openAddModal = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const filtered = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(search) ||
            e.description.toLowerCase().includes(search)
        )
        .filter((e) => (typeFilter ? e.eventType === typeFilter : true))
        .filter((e) => (categoryFilter ? e.category === categoryFilter : true))
        .filter((e) =>
          startDateParam
            ? new Date(e.startDateTime) >= new Date(startDateParam)
            : true
        )
        .filter((e) =>
          endDateParam
            ? new Date(e.endDateTime) <= new Date(endDateParam)
            : true
        )
        .sort((a, b) => {
          if (sort === 'startDate') {
            const comp = a.startDateTime.localeCompare(b.startDateTime);
            return order === 'asc' ? comp : -comp;
          }
          if (sort === 'title') {
            const comp = a.title.localeCompare(b.title);
            return order === 'asc' ? comp : -comp;
          }
          return 0;
        }),
    [
      events,
      categoryFilter,
      sort,
      order,
      search,
      typeFilter,
      startDateParam,
      endDateParam,
    ]
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) newParams.set(name, value);
    else newParams.delete(name);
    router.push('?' + newParams.toString());
  };

  console.log({ filtered });
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Events</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by title or description"
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          name="type"
          defaultValue={typeFilter}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All Types</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
        </select>
        <select
          name="category"
          defaultValue={categoryFilter}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All Categories</option>
          <option value="Social">Social</option>
          <option value="Personal">Personal</option>
          <option value="Business">Business</option>
        </select>
        <select
          name="sort"
          defaultValue={sort}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Sort By</option>
          <option value="startDate">Start Date</option>
          <option value="title">Title</option>
        </select>
        <select
          name="order"
          defaultValue={order}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <input
          type="date"
          name="startDate"
          defaultValue={startDateParam}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="date"
          name="endDate"
          defaultValue={endDateParam}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div className="overflow-auto">
        <EventTable
          setSelectedEvent={setSelectedEvent}
          setModalOpen={setModalOpen}
          filtered={filtered}
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent || undefined}
      />
    </div>
  );
}
