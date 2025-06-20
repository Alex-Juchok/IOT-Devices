export abstract class Role {
  constructor(public name: string) {}

  abstract canAccess(resource: string): boolean;

  static fromName(name: string): Role {
    switch (name) {
      case "guest": return new GuestRole();
      case "viewer": return new ViewerRole();
      case "operator": return new OperatorRole();
      case "admin": return new AdminRole();
      default: throw new Error(`Unknown role: ${name}`);
    }
  }
}

class GuestRole extends Role {
  constructor() { super("guest"); }

  canAccess(resource: string): boolean {
    return resource === "self";
  }
}

class ViewerRole extends Role {
  constructor() { super("viewer"); }

  canAccess(resource: string): boolean {
    return ["self", "read"].includes(resource);
  }
}

class OperatorRole extends Role {
  constructor() { super("operator"); }

  canAccess(resource: string): boolean {
    return ["self", "read", "write", "update", "delete"].includes(resource);
  }
}

class AdminRole extends Role {
  constructor() { super("admin"); }

  canAccess(resource: string): boolean {
    return true; // доступ ко всему
  }
}
