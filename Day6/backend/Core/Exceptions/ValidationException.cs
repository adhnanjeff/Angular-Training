

namespace BugTracker.Core.Exceptions
{
    public class ValidationException : Exception
    {
        // password wrong
        public IDictionary<string, string[]> Errors { get; }
        public ValidationException(IDictionary<string, string[]> errors) : base("Validation Failed") {
            Errors = errors;
        } 
    }
}
