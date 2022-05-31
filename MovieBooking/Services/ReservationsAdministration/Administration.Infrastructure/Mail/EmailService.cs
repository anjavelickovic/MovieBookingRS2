using Administration.Application.Contracts.Infrastructure;
using Administration.Application.Models;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Mail
{
    public class EmailService : IEmailService
    {

        private readonly EmailSettings _mailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> mailSettings, ILogger<EmailService> logger)
        {
            _mailSettings = mailSettings.Value ?? throw new ArgumentNullException(nameof(mailSettings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> SendEmail(Email email)
        {
            var message = new MimeMessage();

            message.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            message.To.Add(MailboxAddress.Parse(email.To));
            message.Subject = email.Subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = email.Body;

            builder.TextBody = email.Body;
            message.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);

            try
            {
                _logger.LogInformation("Sending email via SMTP server {serverName}", _mailSettings.Host);
                await smtp.SendAsync(message);
            }
            catch (Exception e)
            {
                _logger.LogInformation("An error had occured when sending email via SMTP server {ServerName}: {ErrorMessage}", _mailSettings.Host, e.Message);
                return false;
            }
            finally
            {
                smtp.Disconnect(true);
            }

            return true;
        }
    }
}
