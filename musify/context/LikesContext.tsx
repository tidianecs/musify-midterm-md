import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { deleteLiked, getLikedTracks, insertLiked, SavedTrack } from "@/lib/db";

type Action =
  | { type: "load"; tracks: SavedTrack[] }
  | { type: "add"; track: SavedTrack }
  | { type: "remove"; id: number };

function likesReducer(state: SavedTrack[], action: Action): SavedTrack[] {
  switch (action.type) {
    case "load":
      return action.tracks;
    case "add":
      return [action.track, ...state.filter((t) => t.id !== action.track.id)];
    case "remove":
      return state.filter((t) => t.id !== action.id);
  }
}

type LikesValue = {
  likes: SavedTrack[];
  isLiked: (id: number) => boolean;
  toggleLike: (track: SavedTrack) => void;
};

const LikesContext = createContext<LikesValue | null>(null);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likes, dispatch] = useReducer(likesReducer, []);

  useEffect(() => {
    dispatch({ type: "load", tracks: getLikedTracks() });
  }, []);

  function isLiked(id: number) {
    return likes.some((t) => t.id === id);
  }

  function toggleLike(track: SavedTrack) {
    if (isLiked(track.id)) {
      deleteLiked(track.id);
      dispatch({ type: "remove", id: track.id });
    } else {
      insertLiked(track);
      dispatch({ type: "add", track });
    }
  }

  return <LikesContext.Provider value={{ likes, isLiked, toggleLike }}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const value = useContext(LikesContext);
  if (!value) throw new Error("useLikes must be used inside LikesProvider");
  return value;
}
