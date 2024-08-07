// jsonManager.js

class JSONManager {
    constructor(appManager) {
        this.appManager = appManager;
    }

    autoResolveConflicts() {
        if (!confirm("Are you sure you want to auto-resolve all conflicts? This will generate new IDs for the conflicting tiles.")) {
            return;
        }

        this.appManager.resolvedConflicts = this.appManager.conflictIds.map(conflict => {
            const newId = this.appManager.generateUniqueId();
            conflict.newId = newId;
            this.appManager.existingTileIds.add(newId);

            return {
                oldId: conflict.id,
                newId: newId,
                title: conflict.title,
                description: conflict.description
            };
        });

        this.appManager.resolvedConflicts.forEach(resolved => {
            window.TileManager.createTile(resolved.newId, resolved.title, resolved.description);
        });

        this.appManager.nonConflictingItems.forEach(item => {
            if (!this.appManager.existingTileIds.has(item.id)) {
                window.TileManager.createTile(item.id, item.title, item.description);
                this.appManager.existingTileIds.add(item.id);
            }
        });

        alert("All conflicts resolved with new IDs and tiles have been updated.");
        this.appManager.closeModal(this.appManager.conflictModal);

        if (confirm("Would you like to download a JSON file with the details of the resolved conflicts?")) {
            this.downloadResolvedJSON();
        }
    }

    downloadConflictingJSON() {
        if (this.appManager.conflictIds.length === 0) {
            alert("No conflicts to download.");
            return;
        }

        const conflictData = this.appManager.conflictIds.reduce((acc, conflict) => {
            if (!acc[conflict.id]) {
                acc[conflict.id] = [];
            }
            acc[conflict.id].push({
                title: conflict.title,
                description: conflict.description
            });
            acc[conflict.id].push({
                title: conflict.conflictTitle,
                description: window.TileManager.getTileById(conflict.id).dataset.description
            });
            return acc;
        }, {});

        this.downloadJSON(conflictData, "conflicting_ids.json");
    }

    downloadResolvedJSON() {
        if (this.appManager.resolvedConflicts.length === 0) {
            alert("No resolved conflicts to download.");
            return;
        }

        this.downloadJSON(this.appManager.resolvedConflicts, "resolved_conflicts.json");
    }

    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Expose JSONManager to the global scope
window.JSONManager = JSONManager;
