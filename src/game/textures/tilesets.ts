export interface TileSetImportTemplate {
    name: string;
    key: string;
    file: string;
    tileWidth: number;
    tileHeight: number;
    spacing: number;
    margin: number;
}

export const TILESETS : TileSetImportTemplate[] = [
    { name: 'cozy_ground', key: 'cozy_ground', file: 'tiles/complete tile overworld normal.png', tileWidth: 32, tileHeight: 32, spacing: 0, margin: 0},
    { name: 'cozy_water', key: 'cozy_water', file: 'tiles/all animated waters.png', tileWidth: 32, tileHeight: 32, spacing: 0, margin: 0},
    { name: 'cozy_trees', key: 'cozy_trees', file: 'tiles/green trees normal.png', tileWidth: 32, tileHeight: 32, spacing: 0, margin: 0},
    { name: 'small_items_mage', key: 'small_items_mage', file: 'tiles/magetower_tiles_32x32_spacing2.png', tileWidth: 32, tileHeight: 32, spacing: 2, margin: 2},
]