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

<div class="p-6 flex flex-col gap-4 h-full overflow-hidden bg-background">
  <!-- Header -->
  <section class="flex items-center justify-between shrink-0">
    <div>
      <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">
        Filesystem Intelligence
      </h2>
      <p class="text-body-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
        Local-first &middot; read-only &middot; {fileCount} files, {dirCount} folders
      </p>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-3 py-1 border border-outline-variant text-body-sm flex items-center gap-2 hover:bg-surface-container transition-colors text-on-surface-variant"
      >
        <span class="material-symbols-outlined">refresh</span> Re-index
      </button>
    </div>
  </section>

  <!-- Content search over (mock) file contents -->
  <div
    class="flex items-center gap-2 px-2 py-1.5 bg-surface-container-low border border-outline-variant shrink-0 max-w-xl"
  >
    <span class="material-symbols-outlined text-outline">search</span>
    <input
      type="text"
      bind:value={query}
      placeholder="Search file names and contents..."
      class="bg-transparent border-none focus:ring-0 text-body-sm w-full text-on-surface placeholder:text-outline outline-none p-0"
    />
    {#if query}
      <button
        type="button"
        onclick={() => (query = "")}
        class="text-outline hover:text-on-surface"
        aria-label="Clear search"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    {/if}
  </div>

  <!-- Two-pane: file browser (left) + viewer (right) -->
  <div class="grid grid-cols-12 gap-4 flex-1 min-h-0">
    <!-- Left: directory listing -->
    <div
      class="col-span-7 border border-outline-variant bg-surface-container-low flex flex-col overflow-hidden"
    >
      <div class="p-3 border-b border-outline-variant flex items-center justify-between shrink-0">
        <span class="font-label-caps text-label-caps text-outline uppercase tracking-wider">
          Directory
        </span>
        <span class="font-mono-sm text-mono-sm text-primary">{cwd}</span>
      </div>

      <div class="overflow-y-auto flex-1">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container border-b border-outline-variant sticky top-0">
              <th class="px-3 py-2 font-label-caps text-label-caps text-outline">NAME</th>
              <th class="px-3 py-2 font-label-caps text-label-caps text-outline">SIZE</th>
              <th class="px-3 py-2 font-label-caps text-label-caps text-outline">MODIFIED</th>
            </tr>
          </thead>
          <tbody class="font-mono-sm text-mono-sm">
            {#each filtered as entry (entry.name)}
              <tr
                class="border-b border-outline-variant/30 transition-colors cursor-pointer
                  {entry.name === selectedName
                  ? 'bg-surface-container-high'
                  : 'hover:bg-surface-container'}"
                onclick={() => select(entry)}
              >
                <td class="px-3 py-2 text-on-surface truncate max-w-[280px]">
                  <span class="flex items-center gap-2">
                    <span
                      class="material-symbols-outlined {entry.kind === 'dir'
                        ? 'text-primary'
                        : 'text-on-surface-variant'}">{iconFor(entry.kind)}</span
                    >
                    <span class="truncate">{entry.name}</span>
                  </span>
                </td>
                <td class="px-3 py-2 text-on-surface-variant whitespace-nowrap">{entry.size}</td>
                <td class="px-3 py-2 text-outline whitespace-nowrap">{entry.modified}</td>
              </tr>
            {/each}
            {#if filtered.length === 0}
              <tr>
                <td colspan="3" class="px-3 py-8 text-center text-on-surface-variant font-body-sm">
                  No entries match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right: file viewer (plain-text, untrusted content) -->
    <div
      class="col-span-5 border border-outline-variant bg-surface-container-low flex flex-col overflow-hidden"
    >
      <div class="p-3 border-b border-outline-variant flex items-center justify-between shrink-0">
        <span class="font-label-caps text-label-caps text-outline uppercase tracking-wider">
          Viewer
        </span>
        <span class="font-mono-sm text-mono-sm text-outline uppercase">read-only</span>
      </div>

      {#if selected && selected.kind === "file"}
        <div
          class="px-3 py-2 border-b border-outline-variant flex items-center gap-2 shrink-0 bg-surface-container"
        >
          <span class="material-symbols-outlined text-on-surface-variant">description</span>
          <span class="font-mono-md text-mono-md text-on-surface truncate">{selected.name}</span>
          <span class="font-mono-sm text-mono-sm text-outline ml-auto whitespace-nowrap"
            >{selected.size}</span
          >
        </div>
        <!-- Untrusted file contents: rendered as plain text inside <pre>. -->
        <pre
          class="flex-1 overflow-auto p-4 font-mono-md text-mono-md text-on-surface whitespace-pre-wrap break-words m-0">{selected.content ?? ""}</pre>
      {:else}
        <div
          class="flex-1 flex flex-col items-center justify-center gap-2 text-on-surface-variant"
        >
          <span class="material-symbols-outlined text-4xl text-outline">draft</span>
          <span class="font-body-sm">Select a file to view its contents.</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Telemetry strip -->
  <footer
    class="border border-outline-variant bg-surface-container-low px-4 py-2 flex items-center justify-between font-mono-sm text-mono-sm shrink-0"
  >
    <div class="flex gap-6">
      <span class="text-outline uppercase tracking-widest"
        >DISK_USAGE: <span class="text-on-surface">42% (512GB FREE)</span></span
      >
      <span class="text-outline uppercase tracking-widest"
        >MODE: <span class="text-secondary">READ-ONLY</span></span
      >
    </div>
    <div class="flex items-center gap-4">
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> LOCAL_DAEMON:
        CONNECTED
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-outline inline-block"></span> CLOUD_SYNC: PAUSED
      </span>
    </div>
  </footer>
</div>
