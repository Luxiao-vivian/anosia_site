import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For, onMount } from "solid-js"
import Fuse from "fuse.js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"
import SearchBar from "@components/SearchBar"

type Props = {
  entry_name: string
  tags: string[]
  data: CollectionEntry<"blog">[] | CollectionEntry<'projects'>[]
}

export default function SearchCollection({ entry_name, data, tags }: Props) {
  const coerced = data.map((entry) => entry as CollectionEntry<'blog'>);

  const [query, setQuery] = createSignal("");
  const [filter, setFilter] = createSignal(new Set<string>())
  const [collection, setCollection] = createSignal<CollectionEntry<'blog'>[]>([])
  const [descending, setDescending] = createSignal(false);

  const fuse = new Fuse(coerced, {
    keys: ["slug", "data.title", "data.summary", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  })

  createEffect(() => {
    const filtered = (query().length < 2
      ? coerced
      : fuse.search(query()).map((result) => result.item)
    ).filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag: string) =>
          tag.toLowerCase() === String(value).toLowerCase()
        )
      )
    );
    setCollection(descending() ? filtered.toReversed() : filtered)
  })

  function toggleDescending() {
    setDescending(!descending())
  }

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(prev.has(tag)
        ? [...prev].filter((t) => t !== tag)
        : [...prev, tag]
      )
    )
  }

  function clearFilters() {
    setFilter(new Set<string>());
  }

  const onSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setQuery(target.value)
  }

  onMount(() => {
    const wrapper = document.getElementById("search-collection-wrapper");
    if (wrapper) {
      wrapper.style.minHeight = "unset";
    }
  })

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Control Panel*/}
      <div class="col-span-3 sm:col-span-1">
        <div class="sticky top-24 mt-7">
          {/* Search Bar */}
          <SearchBar onSearchInput={onSearchInput} query={query} setQuery={setQuery} placeholderText={`Search ${entry_name}`} />
          {/* Tag Filters */}
          <div class="relative flex flex-row justify-between w-full"><p class="text-sm font-semibold uppercase my-4 text-ink-900">Tags</p>
            {filter().size > 0 && (
              <button
                onClick={clearFilters}
                class="absolute flex justify-center items-center h-full w-10 right-0 top-0 stroke-ink-700/50 hover:stroke-olive-700"
              >
                <svg class="size-5">
                  <use href={`/ui.svg#x`} />
                </svg>
              </button>
            )}</div>
          <ul class="flex flex-wrap sm:flex-col gap-1.5">
            <For each={tags}>
              {(tag) => (
                <li class="sm:w-full">
                  <button
                    onClick={() => toggleTag(tag)}
                    class={cn(
                      "w-full px-2 py-1 rounded",
                      "flex gap-2 items-center",
                      "bg-olive-700/5",
                      "hover:bg-olive-700/15",
                      "transition-colors duration-300 ease-in-out",
                      filter().has(tag) && "text-olive-900"
                    )}
                  >
                    <svg
                      class={cn(
                        "shrink-0 size-5 fill-ink-700/50",
                        "transition-colors duration-300 ease-in-out",
                        filter().has(tag) && "fill-olive-700"
                      )}
                    >
                      <use
                        href={`/ui.svg#square`}
                        class={cn(!filter().has(tag) ? "block" : "hidden")}
                      />
                      <use
                        href={`/ui.svg#square-check`}
                        class={cn(filter().has(tag) ? "block" : "hidden")}
                      />
                    </svg>

                    <span class="truncate block min-w-0 pt-[2px]">
                      {tag}
                    </span>
                  </button>

                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      {/* Posts */}
      <div class="col-span-3 sm:col-span-2">
        <div class="flex flex-col">
          {/* Info Bar */}
          <div class='flex justify-between flex-row mb-2'>
            <div class="text-sm uppercase">
              SHOWING {collection().length} OF {data.length} {entry_name}
            </div>
            <button onClick={toggleDescending} class='flex flex-row gap-1 stroke-ink-700/50 hover:stroke-olive-700 text-ink-700/70 hover:text-olive-700'>
              <div class="text-sm uppercase">
                {descending() ? "DESCENDING" : "ASCENDING"}
              </div>
              <svg
                class="size-5 left-2 top-[0.45rem]"
              >
                <use href={`/ui.svg#sort-descending`} class={descending() ? "block" : "hidden"}></use>
                <use href={`/ui.svg#sort-ascending`} class={descending() ? "hidden" : "block"}></use>
              </svg>
            </button>
          </div>
          <ul class="flex flex-col gap-3">
            {collection().map((entry) => (
              <li>
                <ArrowCard entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
