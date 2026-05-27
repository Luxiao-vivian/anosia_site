type Props = {
    onSearchInput: (e: Event) => void;
    query: () => string;
    setQuery: (value: string) => void;
    placeholderText: string;
};

export default function SearchBar({ onSearchInput, query, setQuery, placeholderText }: Props) {
    return (<div class="relative">
        <svg class="absolute size-6 left-2 top-[0.45rem] stroke-ink-700/50 pointer-events-none">
            <use href={`/ui.svg#search`} />
        </svg>
        <input name="search" type="text" value={query()} onInput={onSearchInput} autocomplete="off" spellcheck={false} placeholder={placeholderText} class="w-full px-10 py-1.5 rounded outline-none placeholder-ink-700/50 text-ink-900 bg-olive-700/5 hover:bg-olive-700/10 focus:bg-olive-700/10 border border-olive-700/15 focus:border-olive-700/40" />
        {query().length > 0 && (
            <button
                onClick={() => setQuery("")}
                class="absolute flex justify-center items-center h-full w-10 right-0 top-0 stroke-ink-700/50 hover:stroke-olive-700"
            >
                <svg class="size-5">
                    <use href={`/ui.svg#x`} />
                </svg>
            </button>
        )}
    </div>)
}