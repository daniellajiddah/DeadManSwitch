;; dead-mans-switch.clar

;; Constants
(define-constant err-unauthorized (err u100))
(define-constant err-already-initialized (err u101))
(define-constant err-not-initialized (err u102))
(define-constant err-too-early (err u103))

;; Data variables
(define-data-var last-check-in uint u0)
(define-data-var check-in-period uint u0)
(define-data-var owner principal tx-sender)
(define-data-var beneficiary principal tx-sender)

;; Public functions
(define-public (initialize (period uint) (beneficiary-address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-unauthorized)
    (asserts! (is-eq (var-get check-in-period) u0) err-already-initialized)
    (var-set check-in-period period)
    (var-set beneficiary beneficiary-address)
    (var-set last-check-in block-height)
    (ok true)))

(define-public (check-in)
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) err-unauthorized)
    (asserts! (> (var-get check-in-period) u0) err-not-initialized)
    (var-set last-check-in block-height)
    (ok true)))

(define-public (trigger-switch)
  (let ((current-time block-height)
        (last-check (var-get last-check-in))
        (period (var-get check-in-period)))
    (asserts! (>= (- current-time last-check) period) err-too-early)
    (as-contract (stx-transfer? (stx-get-balance tx-sender) tx-sender (var-get beneficiary)))))

;; Read-only functions
(define-read-only (get-last-check-in)
  (ok (var-get last-check-in)))

(define-read-only (get-check-in-period)
  (ok (var-get check-in-period)))

(define-read-only (get-owner)
  (ok (var-get owner)))

(define-read-only (get-beneficiary)
  (ok (var-get beneficiary)))

(define-read-only (get-time-since-last-check-in)
  (ok (- block-height (var-get last-check-in))))

