

export interface Asset {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'audio';
    preview?: string; // For audio, maybe an icon or visualizer placeholder
    description?: string;
  }
  
  export const ASSETS = {
    sprites: [
      {
        id: 'sprite-pikachu',
        name: 'Pikachu',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        type: 'image',
        description: 'Electric type Pokemon'
      },
      {
        id: 'sprite-charizard',
        name: 'Charizard',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        type: 'image',
        description: 'Fire/Flying type Pokemon'
      },
      {
        id: 'sprite-gengar',
        name: 'Gengar',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
        type: 'image',
        description: 'Ghost/Poison type Pokemon'
      },
      {
        id: 'sprite-mewtwo',
        name: 'Mewtwo',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
        type: 'image',
        description: 'Legendary Psychic Pokemon'
      },
      {
        id: 'sprite-eevee',
        name: 'Eevee',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
        type: 'image',
        description: 'Normal type Pokemon'
      },
      {
        id: 'sprite-magikarp',
        name: 'Magikarp',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png',
        type: 'image',
        description: 'Water type Pokemon'
      },
      {
        id: 'sprite-snorlax',
        name: 'Snorlax',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
        type: 'image',
        description: 'Sleeping Pokemon'
      },
      {
        id: 'sprite-ditto',
        name: 'Ditto',
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
        type: 'image',
        description: 'Transforming Pokemon'
      }
    ],
    items: [
      {
        id: 'item-sword-diamond',
        name: 'Diamond Sword',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/diamond_sword.png',
        type: 'image',
        description: 'Powerful melee weapon'
      },
      {
        id: 'item-apple-gold',
        name: 'Golden Apple',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/golden_apple.png',
        type: 'image',
        description: 'Healing item'
      },
      {
        id: 'item-potion-red',
        name: 'Health Potion',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/potion.png',
        type: 'image',
        description: 'Restores health'
      },
      {
        id: 'item-diamond',
        name: 'Diamond',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/diamond.png',
        type: 'image',
        description: 'Rare gem'
      },
      {
        id: 'item-emerald',
        name: 'Emerald',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/emerald.png',
        type: 'image',
        description: 'Trading currency'
      },
      {
        id: 'item-chest',
        name: 'Chest',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/chest_minecart.png',
        type: 'image',
        description: 'Loot container'
      },
       {
        id: 'item-totem',
        name: 'Totem of Undying',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/totem_of_undying.png',
        type: 'image',
        description: 'Magical artifact'
      },
       {
        id: 'item-book',
        name: 'Enchanted Book',
        url: 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/item/enchanted_book.png',
        type: 'image',
        description: 'Magic spell book'
      }
    ],
    backgrounds: [
      {
        id: 'bg-space',
        name: 'Deep Space',
        url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1000&q=80',
        type: 'image',
        description: 'Starry nebula texture'
      },
      {
        id: 'bg-grass',
        name: 'Grass Texture',
        url: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=1000&q=80',
        type: 'image',
        description: 'Top-down grass field'
      },
      {
        id: 'bg-stone',
        name: 'Dungeon Stone',
        url: 'https://images.unsplash.com/photo-1518035222718-245c4795b5e3?w=1000&q=80',
        type: 'image',
        description: 'Dark stone wall texture'
      },
      {
        id: 'bg-water',
        name: 'Ocean Water',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
        type: 'image',
        description: 'Blue water surface'
      },
      {
        id: 'bg-wood',
        name: 'Wood Planks',
        url: 'https://images.unsplash.com/photo-1579370845353-96b527de2d31?w=1000&q=80',
        type: 'image',
        description: 'Wooden floor texture'
      },
      {
        id: 'bg-lava',
        name: 'Lava/Fire',
        url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1000&q=80',
        type: 'image',
        description: 'Abstract fire texture'
      }
    ],
    audio: [
      {
        id: 'sfx-jump',
        name: 'Jump (Pop)',
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
        type: 'audio',
        description: 'Short pop sound'
      },
      {
        id: 'sfx-coin',
        name: 'Coin Pickup',
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav',
        type: 'audio',
        description: 'Retro point gain'
      },
      {
        id: 'sfx-laser',
        name: 'Laser Shoot',
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/week7-brrring.m4a',
        type: 'audio',
        description: 'Laser/Ring sound'
      },
      {
        id: 'sfx-explosion',
        name: 'Explosion',
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_hit.wav',
        type: 'audio',
        description: 'Retro explosion'
      },
      {
        id: 'sfx-powerup',
        name: 'Power Up',
        url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pyman_assets/eatedible.ogg',
        type: 'audio',
        description: 'Chomp/Power up sound'
      },
      {
        id: 'sfx-pikachu',
        name: 'Pikachu Cry',
        url: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg',
        type: 'audio',
        description: 'Pikachu voice'
      }
    ]
  } as const;