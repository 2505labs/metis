<script lang="ts">
  // Files Agent — LOCAL, READ-ONLY MVP.
  // Capabilities: list a directory, read a text file, search file contents.
  // No write/delete/move actions here — Files MVP never mutates the filesystem.
  //
  // SECURITY: entry names and file contents are UNTRUSTED. They render as plain
  // text only (Svelte escapes {expr}), never via {@html}.

  type Kind = "dir" | "file";

  interface Entry {
    name: string;
    kind: Kind;
    size: string; // human-readable; dirs show item count
    modified: string;
    content?: string; // mock text contents, files only
  }

  // Mock directory listing (a $state so a future Tauri invoke() can replace it).
  let cwd = $state("~/projects/metis");

  let entries = $state<Entry[]>([
    { name: "src", kind: "dir", size: "14 items", modified: "2026-06-14 14:01" },
    { name: "crates", kind: "dir", size: "6 items", modified: "2026-06-12 09:22" },
    { name: "src-tauri", kind: "dir", size: "9 items", modified: "2026-06-13 18:40" },
    {
      name: "README.md",
      kind: "file",
      size: "2.1 KB",
      modified: "2026-06-10 11:05",
      content:
        "# Metis\n\nA local-first desktop agent app built on Tauri.\n\nThree agents — Calendar, Email, Files — observe the user's data and\n*propose* actions. A human approves anything that writes.\n\n## Build order\n\nFiles -> Calendar -> Email. Files is local, so it proves the entire\ncontract (agent -> gate -> log -> done) with zero OAuth friction.\n",
    },
    {
      name: "package.json",
      kind: "file",
      size: "684 B",
      modified: "2026-06-14 14:01",
      content:
        '{\n  "name": "metis-ui",\n  "version": "2.4.0",\n  "private": true,\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  }\n}\n',
    },
    {
      name: "daily_telemetry.log",
      kind: "file",
      size: "18.4 KB",
      modified: "2026-06-14 14:02",
      content:
        "14:02:11.45  INFO   indexer: scanned 1,402,118 entries\n14:02:08.12  INFO   daemon: local snapshot committed\n14:01:55.33  DEBUG  watcher: fs event coalesced (write)\n14:01:42.90  INFO   indexer: incremental pass complete\n14:01:30.01  WARN   watcher: high event rate, backpressure on\n14:01:12.77  INFO   daemon: cloud sync paused by operator\n",
    },
    {
      name: "files.rs",
      kind: "file",
      size: "5.7 KB",
      modified: "2026-06-13 16:30",
      content:
        "// Files agent — thin adapter over the shared A2A-shaped contract.\n// Tier-1 (read-only) skills only for the MVP: list_dir, read_file, search.\n\npub struct FilesAgent {\n    root: PathBuf,\n}\n\nimpl FilesAgent {\n    pub fn list_dir(&self, path: &Path) -> Result<Vec<Entry>> {\n        // ... read-only directory listing ...\n    }\n}\n",
    },
    {
      name: ".gitignore",
      kind: "file",
      size: "112 B",
      modified: "2026-05-30 08:14",
      content: "node_modules/\ndist/\ntarget/\n.DS_Store\n*.local\n",
    },
  ]);

  // Selection + content search (search runs over mock file contents only).
  let selectedName = $state<string | null>("README.md");
  let query = $state("");

  const selected = $derived(entries.find((e) => e.name === selectedName) ?? null);

  const filtered = $derived(
    query.trim() === ""
      ? entries
      : entries.filter((e) => {
          const q = query.toLowerCase();
          return (
            e.name.toLowerCase().includes(q) ||
            (e.content?.toLowerCase().includes(q) ?? false)
          );
        }),
  );

  const fileCount = $derived(entries.filter((e) => e.kind === "file").length);
  const dirCount = $derived(entries.filter((e) => e.kind === "dir").length);

  function select(entry: Entry) {
    // Only files open in the viewer; dirs are inert in this mock (no navigation wired).
    if (entry.kind === "file") selectedName = entry.name;
  }

  function iconFor(kind: Kind): string {
    return kind === "dir" ? "folder" : "description";
  }
</script>

<div class="p-margin-page max-w-7xl mx-auto">
  <!-- Header -->
  <header class="mb-10 flex items-start justify-between gap-6">
    <div class="flex items-start gap-4">
      <div
        class="w-14 h-14 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-3xl">folder</span>
      </div>
      <div>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">
          Filesystem Intelligence
        </h2>
        <p class="text-on-surface-variant flex items-center gap-2 mt-1">
          <span class="w-2 h-2 rounded-full bg-primary status-glow-active inline-block"></span>
          Local-first · read-only · {fileCount} files, {dirCount} folders
        </p>
      </div>
    </div>
    <span
      class="bg-surface-container-high text-on-surface-variant rounded-full px-3 py-1 font-label-mono text-[11px] uppercase shrink-0"
    >
      Read-only
    </span>
  </header>

  <!-- Content search over (mock) file contents -->
  <div class="mb-8 max-w-xl">
    <div
      class="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest/40 rounded-xl border border-white/5"
    >
      <span class="material-symbols-outlined text-outline">search</span>
      <input
        type="text"
        bind:value={query}
        placeholder="Search file names and contents..."
        class="bg-transparent border-none focus:ring-0 font-body-sm w-full text-on-surface placeholder:text-outline outline-none p-0"
      />
      {#if query}
        <button
          type="button"
          onclick={() => (query = "")}
          class="text-outline hover:text-on-surface transition-colors"
          aria-label="Clear search"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      {/if}
    </div>
  </div>

  <!-- Two-pane: file browser (left) + viewer (right) -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left: directory listing -->
    <section
      class="lg:col-span-7 bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col"
    >
      <div class="flex items-center justify-between mb-6">
        <h4 class="font-title-md text-title-md text-on-surface">Directory</h4>
        <span class="font-label-mono text-label-mono text-secondary truncate max-w-[55%]"
          >{cwd}</span
        >
      </div>

      <div class="bg-surface-container-lowest/40 rounded-2xl p-4 border border-white/5">
        <table class="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr
              class="text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider"
            >
              <th class="pb-3 px-3">Name</th>
              <th class="pb-3 px-3">Size</th>
              <th class="pb-3 px-3">Modified</th>
            </tr>
          </thead>
          <tbody class="font-label-mono text-label-mono">
            {#each filtered as entry (entry.name)}
              <tr
                class="transition-colors cursor-pointer
                  {entry.name === selectedName
                  ? 'bg-surface-container-high border border-white/5'
                  : 'hover:bg-surface-container-high/60'}"
                onclick={() => select(entry)}
              >
                <td class="py-3 px-3 rounded-l-2xl text-on-surface truncate max-w-[280px]">
                  <span class="flex items-center gap-2">
                    <span
                      class="material-symbols-outlined text-[18px] {entry.kind === 'dir'
                        ? 'text-secondary'
                        : 'text-on-surface-variant'}">{iconFor(entry.kind)}</span
                    >
                    <span class="truncate">{entry.name}</span>
                  </span>
                </td>
                <td class="py-3 px-3 text-on-surface-variant whitespace-nowrap">{entry.size}</td>
                <td class="py-3 px-3 rounded-r-2xl text-outline whitespace-nowrap"
                  >{entry.modified}</td
                >
              </tr>
            {/each}
            {#if filtered.length === 0}
              <tr>
                <td
                  colspan="3"
                  class="py-10 px-3 text-center text-on-surface-variant font-body-sm"
                >
                  No entries match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Right: file viewer (plain-text, untrusted content) -->
    <section
      class="lg:col-span-5 bg-surface-container-low/60 backdrop-blur-xl rounded-[32px] p-gutter glass-panel shadow-xl flex flex-col"
    >
      <div class="flex items-center justify-between mb-6">
        <h4 class="font-title-md text-title-md text-on-surface">Viewer</h4>
        <span
          class="bg-surface-container-high text-on-surface-variant rounded-full px-3 py-1 font-label-mono text-[11px] uppercase"
        >
          Read-only
        </span>
      </div>

      {#if selected && selected.kind === "file"}
        <div class="flex items-center gap-2 mb-4 px-2">
          <span class="material-symbols-outlined text-secondary">description</span>
          <span class="font-label-mono text-label-mono text-on-surface truncate"
            >{selected.name}</span
          >
          <span class="font-label-mono text-label-mono text-outline ml-auto whitespace-nowrap"
            >{selected.size}</span
          >
        </div>
        <!-- Untrusted file contents: rendered as plain text inside <pre>. -->
        <div
          class="flex-1 bg-surface-container-lowest/60 rounded-2xl p-4 border border-white/5 overflow-auto"
        >
          <pre
            class="font-label-mono text-label-mono whitespace-pre-wrap break-words text-on-surface-variant m-0">{selected.content ?? ""}</pre>
        </div>
      {:else}
        <div
          class="flex-1 bg-surface-container-lowest/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 text-on-surface-variant py-16"
        >
          <span class="material-symbols-outlined text-4xl text-outline">draft</span>
          <span class="font-body-sm">Select a file to view its contents.</span>
        </div>
      {/if}
    </section>
  </div>

  <!-- Telemetry strip -->
  <footer
    class="mt-8 bg-surface-container-lowest/40 rounded-2xl border border-white/5 px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-label-mono text-label-mono"
  >
    <div class="flex flex-wrap gap-6">
      <span class="text-on-surface-variant uppercase tracking-wider"
        >Disk usage: <span class="text-on-surface">42% (512GB free)</span></span
      >
      <span class="text-on-surface-variant uppercase tracking-wider"
        >Mode: <span class="text-secondary">Read-only</span></span
      >
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <span class="flex items-center gap-2 text-on-surface-variant uppercase tracking-wider">
        <span class="w-2 h-2 rounded-full bg-primary status-glow-active inline-block"></span>
        Local daemon: connected
      </span>
      <span class="flex items-center gap-2 text-on-surface-variant uppercase tracking-wider">
        <span class="w-2 h-2 rounded-full bg-outline inline-block"></span>
        Cloud sync: paused
      </span>
    </div>
  </footer>
</div>
