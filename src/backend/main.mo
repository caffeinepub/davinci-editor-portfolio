import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
  };

  type VideoProject = {
    id : Nat;
    title : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    category : Text;
  };

  type ContactFormSubmission = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Video project management
  let videoProjects = Map.empty<Nat, VideoProject>();
  var nextProjectId = 0;

  // Contact form submissions
  let contactSubmissions = Map.empty<Nat, ContactFormSubmission>();
  var nextSubmissionId = 0;

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video project CRUD
  public shared ({ caller }) func createVideoProject(project : VideoProject) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create video projects");
    };
    let newId = nextProjectId;
    let newProject = {
      project with
      id = newId;
    };
    videoProjects.add(newId, newProject);
    nextProjectId += 1;
    newId;
  };

  public query ({ caller }) func getAllVideoProjects() : async [VideoProject] {
    videoProjects.values().toArray();
  };

  public shared ({ caller }) func updateVideoProject(id : Nat, project : VideoProject) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update video projects");
    };
    if (not videoProjects.containsKey(id)) {
      Runtime.trap("Video project not found");
    };
    let updatedProject = {
      project with
      id;
    };
    videoProjects.add(id, updatedProject);
  };

  public shared ({ caller }) func deleteVideoProject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete video projects");
    };
    videoProjects.remove(id);
  };

  // Contact form handling
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
    let newId = nextSubmissionId;
    let submission : ContactFormSubmission = {
      id = newId;
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(newId, submission);
    nextSubmissionId += 1;
    newId;
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.values().toArray();
  };

  public query ({ caller }) func getContactSubmissionsCount() : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact submission count");
    };
    contactSubmissions.size();
  };
};
