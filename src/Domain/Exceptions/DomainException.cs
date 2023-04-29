using System.Globalization;

namespace Domain.Exceptions
{
    public class DomainException : Exception
    {
        public DomainException() : base() { }

        public DomainException(string message) : base(message) { }

        public DomainException(string message, params object[] args)
            : base(string.Format(CultureInfo.CurrentCulture, message, args))
        {
        }
    }
}
