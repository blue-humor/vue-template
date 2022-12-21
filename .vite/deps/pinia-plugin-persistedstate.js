import "./chunk-FAW2VN4A.js";

// node_modules/pinia-plugin-persistedstate/dist/chunk-256H5QT7.mjs
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function isObject(v) {
  return typeof v === "object" && v !== null;
}
function identity(v) {
  return v;
}
function normalizeOptions(options, factoryOptions) {
  options = isObject(options) ? options : /* @__PURE__ */ Object.create(null);
  return new Proxy(options, {
    get(target, key, receiver) {
      var _a;
      if (key === "key") {
        return ((_a = factoryOptions.key) != null ? _a : identity)(
          Reflect.get(target, key, receiver)
        );
      }
      return Reflect.get(target, key, receiver) || Reflect.get(factoryOptions, key, receiver);
    }
  });
}
function isObject2(value) {
  return value !== null && typeof value === "object";
}
function merge(destination, source) {
  const mergingArrays = Array.isArray(destination) && Array.isArray(source);
  const mergingObjects = isObject2(destination) && isObject2(source);
  if (!mergingArrays && !mergingObjects) {
    throw new Error("Can only merge object with object or array with array");
  }
  const result = mergingArrays ? [] : {};
  const keys = [...Object.keys(destination), ...Object.keys(source)];
  keys.forEach((key) => {
    if (Array.isArray(destination[key]) && Array.isArray(source[key])) {
      result[key] = [
        ...Object.values(
          merge(destination[key], source[key])
        )
      ];
    } else if (source[key] !== null && typeof source[key] === "object" && typeof destination[key] === "object") {
      result[key] = merge(
        destination[key],
        source[key]
      );
    } else if (destination[key] !== void 0 && source[key] === void 0) {
      result[key] = destination[key];
    } else if (destination[key] === void 0 && source[key] !== void 0) {
      result[key] = source[key];
    }
  });
  return result;
}
function get(state, path) {
  return path.reduce((obj, p) => {
    if (p === "[]" && Array.isArray(obj))
      return obj;
    return obj == null ? void 0 : obj[p];
  }, state);
}
function set(state, path, val) {
  const modifiedState = path.slice(0, -1).reduce((obj, p) => {
    if (!/^(__proto__)$/.test(p))
      return obj[p] = obj[p] || {};
    else
      return {};
  }, state);
  if (Array.isArray(modifiedState[path[path.length - 1]]) && Array.isArray(val)) {
    const merged = modifiedState[path[path.length - 1]].map(
      (item, index) => {
        if (Array.isArray(item) && typeof item !== "object") {
          return [...item, ...val[index]];
        }
        if (typeof item === "object" && item !== null && Object.keys(item).some((key) => Array.isArray(item[key]))) {
          return merge(item, val[index]);
        }
        return __spreadValues(__spreadValues({}, item), val[index]);
      }
    );
    modifiedState[path[path.length - 1]] = merged;
  } else if (path[path.length - 1] === void 0 && Array.isArray(modifiedState) && Array.isArray(val)) {
    modifiedState.push(...val);
  } else {
    modifiedState[path[path.length - 1]] = val;
  }
  return state;
}
function pick(baseState, paths) {
  return paths.reduce(
    (substate, path) => {
      const pathArray = path.split(".");
      if (!pathArray.includes("[]")) {
        return set(substate, pathArray, get(baseState, pathArray));
      }
      const arrayIndex = pathArray.indexOf("[]");
      const pathArrayBeforeArray = pathArray.slice(0, arrayIndex);
      const pathArrayUntilArray = pathArray.slice(0, arrayIndex + 1);
      const pathArrayAfterArray = pathArray.slice(arrayIndex + 1);
      const referencedArray = get(
        baseState,
        pathArrayUntilArray
      );
      const referencedArraySubstate = [];
      for (const item of referencedArray) {
        if (pathArrayAfterArray.length !== 0 && (Array.isArray(item) || typeof item === "object")) {
          referencedArraySubstate.push(
            pick(item, [pathArrayAfterArray.join(".")])
          );
        } else {
          referencedArraySubstate.push(item);
        }
      }
      return set(substate, pathArrayBeforeArray, referencedArraySubstate);
    },
    Array.isArray(baseState) ? [] : {}
  );
}
function hydrateStore(store, storage, serializer, key, debug) {
  try {
    const fromStorage = storage == null ? void 0 : storage.getItem(key);
    if (fromStorage)
      store.$patch(serializer == null ? void 0 : serializer.deserialize(fromStorage));
  } catch (error) {
    if (debug)
      console.error(error);
  }
}
function createPersistedState(factoryOptions = {}) {
  return (context) => {
    const {
      options: { persist },
      store
    } = context;
    if (!persist)
      return;
    const persistences = (Array.isArray(persist) ? persist.map((p) => normalizeOptions(p, factoryOptions)) : [normalizeOptions(persist, factoryOptions)]).map(
      ({
        storage = localStorage,
        beforeRestore = null,
        afterRestore = null,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse
        },
        key = store.$id,
        paths = null,
        debug = false
      }) => ({
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key,
        paths,
        debug
      })
    );
    persistences.forEach((persistence) => {
      const {
        storage,
        serializer,
        key,
        paths,
        beforeRestore,
        afterRestore,
        debug
      } = persistence;
      beforeRestore == null ? void 0 : beforeRestore(context);
      hydrateStore(store, storage, serializer, key, debug);
      afterRestore == null ? void 0 : afterRestore(context);
      store.$subscribe(
        (_mutation, state) => {
          try {
            const toStore = Array.isArray(paths) ? pick(state, paths) : state;
            storage.setItem(key, serializer.serialize(toStore));
          } catch (error) {
            if (debug)
              console.error(error);
          }
        },
        {
          detached: true
        }
      );
    });
    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((persistence) => {
        const { beforeRestore, afterRestore, storage, serializer, key, debug } = persistence;
        if (runHooks)
          beforeRestore == null ? void 0 : beforeRestore(context);
        hydrateStore(store, storage, serializer, key, debug);
        if (runHooks)
          afterRestore == null ? void 0 : afterRestore(context);
      });
    };
  };
}

// node_modules/pinia-plugin-persistedstate/dist/index.mjs
var src_default = createPersistedState();
export {
  createPersistedState,
  src_default as default
};
//# sourceMappingURL=pinia-plugin-persistedstate.js.map
