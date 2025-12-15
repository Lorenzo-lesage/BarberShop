<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
</head>

<body>
    <h2>New barber request</h2>

    <p>
        User <strong>{{ $user->name }}</strong> ({{ $user->email }})
        requested to become a barber.
    </p>

    <p>
        Click the button below to approve:
    </p>

    <p>
        <a href="{{ $approveUrl }}"
            style="
                display:inline-block;
                padding:10px 16px;
                background:#000;
                color:#fff;
                text-decoration:none;
                border-radius:6px;
           ">
            Approve barber
        </a>
    </p>

    <p>
        If you did not expect this request, you can ignore this email.
    </p>
</body>

</html>
