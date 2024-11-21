;; asset-manager.clar

;; Constants
(define-constant err-unauthorized (err u100))
(define-constant err-transfer-failed (err u101))

;; Public functions
(define-public (transfer-assets (recipient principal))
  (let ((balance (stx-get-balance (as-contract tx-sender))))
    (if (> balance u0)
        (as-contract (stx-transfer? balance tx-sender recipient))
        (ok false))))

;; Read-only functions
(define-read-only (get-balance)
  (ok (stx-get-balance (as-contract tx-sender))))

