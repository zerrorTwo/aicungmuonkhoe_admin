// Simple stub for permission hook
export default function usePermission() {
  return {
    viewable: true,
    creatable: true,
    updatable: true,
    deletable: true,
    importable: true,
    exportable: true,
    getPermissions: () => ({}),
    getAllowedPermissions: () => [],
  };
}
